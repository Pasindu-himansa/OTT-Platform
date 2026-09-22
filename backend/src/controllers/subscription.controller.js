const { Op } = require("sequelize");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const { v4: uuidv4 } = require("uuid");
const { createNotification } = require("./notification.controller");

// GET /api/v1/subscriptions/plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { isActive: true },
      order: [
        ["sortOrder", "ASC"],
        ["price", "ASC"],
      ],
    });
    return res.json({ success: true, data: { plans } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/subscriptions/my
const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId: req.user.id,
        status: "active",
        endDate: { [Op.gt]: new Date() },
      },
      include: [{ model: Plan, as: "plan" }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      data: {
        subscription,
        isActive: !!subscription,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/subscriptions/subscribe
const subscribe = async (req, res) => {
  try {
    const { planId, paymentMethod = "card", transactionId } = req.body;

    const plan = await Plan.findByPk(planId);
    if (!plan || !plan.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    // Check existing active subscription
    const existing = await Subscription.findOne({
      where: {
        userId: req.user.id,
        status: "active",
        endDate: { [Op.gt]: new Date() },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have an active subscription",
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      planId,
      amount: plan.price,
      currency: plan.currency,
      status: "success", // in real app: pending until gateway confirms
      method: paymentMethod,
      transactionId: transactionId || uuidv4(),
      gateway: "manual",
      paidAt: new Date(),
    });

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.user.id,
      planId,
      status: "active",
      startDate,
      endDate,
      autoRenew: true,
    });

    // Link payment to subscription
    await payment.update({ subscriptionId: subscription.id });

    // Create notification
    await createNotification(
      req.user.id,
      "Subscription Activated",
      `You have successfully subscribed to ${plan.name} plan. Enjoy unlimited streaming!`,
      "subscription",
      "fa-crown",
      "var(--success-soft)",
      "var(--success)",
    );

    return res.status(201).json({
      success: true,
      message: `Subscribed to ${plan.name} successfully`,
      data: { subscription, payment },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/subscriptions/cancel
const cancelSubscription = async (req, res) => {
  try {
    const { reason } = req.body;
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id, status: "active" },
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "No active subscription found" });
    }

    await subscription.update({
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason: reason || "User cancelled",
    });

    return res.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/subscriptions  (admin)
const getAllSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Subscription.findAndCountAll({
      include: [{ model: Plan, as: "plan" }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: {
        subscriptions: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/subscriptions/plans  (admin)
const createPlan = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      currency,
      durationDays,
      maxDevices,
      maxQuality,
      features,
      sortOrder,
    } = req.body;
    const planSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    const plan = await Plan.create({
      name,
      slug: planSlug,
      description,
      price,
      currency,
      durationDays,
      maxDevices,
      maxQuality,
      features,
      sortOrder,
    });
    return res
      .status(201)
      .json({ success: true, message: "Plan created", data: { plan } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  getMySubscription,
  subscribe,
  cancelSubscription,
  getAllSubscriptions,
};
