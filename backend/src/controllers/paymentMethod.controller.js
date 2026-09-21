const { PaymentMethod } = require("../config/postgres");

// GET /api/v1/payment-methods
const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({
      where: { userId: req.user.id },
      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    return res.json({ success: true, data: { methods } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/payment-methods
const addPaymentMethod = async (req, res) => {
  try {
    const { type, last4, expiryMonth, expiryYear, holderName, isDefault } =
      req.body;

    // If setting as default remove other defaults
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { userId: req.user.id } },
      );
    }

    const method = await PaymentMethod.create({
      userId: req.user.id,
      type,
      last4,
      expiryMonth,
      expiryYear,
      holderName,
      isDefault: isDefault || false,
    });

    return res.status(201).json({ success: true, data: { method } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/payment-methods/:id
const deletePaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    return res.json({ success: true, message: "Payment method removed" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/payment-methods/:id/default
const setDefault = async (req, res) => {
  try {
    await PaymentMethod.update(
      { isDefault: false },
      { where: { userId: req.user.id } },
    );
    await PaymentMethod.update(
      { isDefault: true },
      { where: { id: req.params.id, userId: req.user.id } },
    );
    return res.json({
      success: true,
      message: "Default payment method updated",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefault,
};
