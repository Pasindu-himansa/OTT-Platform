const { Router } = require("express");
const {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
} = require("../controllers/watchHistory.controller");
const { protect } = require("../middleware/auth");

const router = Router();

router.get("/", protect, getHistory);
router.post("/", protect, addToHistory);
router.delete("/clear", protect, clearHistory);
router.delete("/:videoId", protect, removeFromHistory);

module.exports = router;
