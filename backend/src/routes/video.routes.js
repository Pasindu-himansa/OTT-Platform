const { Router } = require("express");
const {
  getVideos,
  getVideoById,
  getEpisodes,
  getTrending,
  createVideo,
  updateVideo,
  deleteVideo,
  uploadVideo,
} = require("../controllers/video.controller");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = Router();

// Public
router.get("/", getVideos);
router.get("/trending", getTrending);
router.get("/:id", getVideoById);
router.get("/series/:seriesId/episodes", getEpisodes);

// Admin / Content Manager
router.post("/", protect, authorize("admin", "content_manager"), createVideo);
router.put("/:id", protect, authorize("admin", "content_manager"), updateVideo);
router.delete("/:id", protect, authorize("admin"), deleteVideo);

// File upload
router.post(
  "/upload",
  protect,
  authorize("admin", "content_manager"),
  upload.single("video"),
  uploadVideo,
);

module.exports = router;
