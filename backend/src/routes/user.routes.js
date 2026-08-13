const { Router } = require("express");
const { body, param } = require("express-validator");
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = Router();

// ─── Authenticated user routes ────────────────────────────────
router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
  ],
  validate,
  updateProfile,
);

router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
  ],
  validate,
  changePassword,
);

// ─── Admin only routes ────────────────────────────────────────
router.get("/", protect, authorize("admin"), getAllUsers);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isUUID().withMessage("Invalid user ID")],
  validate,
  getUserById,
);

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  [
    param("id").isUUID().withMessage("Invalid user ID"),
    body("isActive").isBoolean().withMessage("isActive must be boolean"),
  ],
  validate,
  updateUserStatus,
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isUUID().withMessage("Invalid user ID")],
  validate,
  deleteUser,
);

module.exports = router;
