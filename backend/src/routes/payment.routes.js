const { Router } = require("express");
const {
  getMyPayments,
  getAllPayments,
  getPaymentById,
} = require("../controllers/payment.controller");
const { protect, authorize } = require("../middleware/auth");

const router = Router();

router.get("/my", protect, getMyPayments);
router.get("/", protect, authorize("admin"), getAllPayments);
router.get("/:id", protect, authorize("admin"), getPaymentById);

module.exports = router;
