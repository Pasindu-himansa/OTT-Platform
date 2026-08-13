const { Router } = require("express");
const { body } = require("express-validator");
const {
  getPlans,
  createPlan,
  getMySubscription,
  subscribe,
  cancelSubscription,
  getAllSubscriptions,
} = require("../controllers/subscription.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = Router();

// Plans
router.get("/plans", getPlans);
router.post(
  "/plans",
  protect,
  authorize("admin"),
  [
    body("name").notEmpty().withMessage("Name required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price required"),
    body("durationDays")
      .isInt({ min: 1 })
      .withMessage("Valid duration required"),
  ],
  validate,
  createPlan,
);

// Subscriptions
router.get("/my", protect, getMySubscription);
router.post(
  "/subscribe",
  protect,
  [body("planId").isUUID().withMessage("Valid plan ID required")],
  validate,
  subscribe,
);
router.post(
  "/cancel",
  protect,
  [body("reason").optional().isString()],
  validate,
  cancelSubscription,
);

// Admin
router.get("/", protect, authorize("admin"), getAllSubscriptions);

module.exports = router;
