const { Router } = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  verifyOtp,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validate,
  register,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login,
);

router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token required")],
  validate,
  refresh,
);

router.post("/logout", logout);

router.get("/me", protect, me);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  forgotPassword,
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validate,
  verifyOtp,
);

module.exports = router;
