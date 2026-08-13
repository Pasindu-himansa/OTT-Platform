const { Router } = require("express");
const {
  getChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
} = require("../controllers/channel.controller");
const { protect, authorize } = require("../middleware/auth");

const router = Router();

// Public
router.get("/", getChannels);
router.get("/:id", getChannelById);

// Admin / Content Manager
router.post("/", protect, authorize("admin", "content_manager"), createChannel);
router.put(
  "/:id",
  protect,
  authorize("admin", "content_manager"),
  updateChannel,
);
router.delete("/:id", protect, authorize("admin"), deleteChannel);

module.exports = router;
