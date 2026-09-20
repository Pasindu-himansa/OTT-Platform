const { Router } = require("express");
const {
  getNotifications,
  markAllRead,
  markRead,
} = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth");

const router = Router();

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAllRead);
router.put("/:id/read", protect, markRead);

module.exports = router;
