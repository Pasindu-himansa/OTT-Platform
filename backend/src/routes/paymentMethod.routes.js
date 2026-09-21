const { Router } = require("express");
const {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefault,
} = require("../controllers/paymentMethod.controller");
const { protect } = require("../middleware/auth");

const router = Router();

router.get("/", protect, getPaymentMethods);
router.post("/", protect, addPaymentMethod);
router.delete("/:id", protect, deletePaymentMethod);
router.put("/:id/default", protect, setDefault);

module.exports = router;
