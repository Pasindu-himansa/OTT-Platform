const WatchHistory = require("../models/WatchHistory");

// POST /api/v1/watch-history
const addToHistory = async (req, res) => {
  try {
    const {
      videoId,
      title,
      type,
      thumbnail,
      gradient,
      emoji,
      meta,
      progress,
      duration,
      percent,
      completed,
    } = req.body;

    const entry = await WatchHistory.findOneAndUpdate(
      { userId: req.user.id, videoId },
      {
        userId: req.user.id,
        videoId,
        title,
        type,
        thumbnail,
        gradient,
        emoji,
        meta,
        progress: progress || 0,
        duration: duration || 0,
        percent: percent || 0,
        completed: completed || false,
        watchedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    return res.json({ success: true, data: { entry } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/watch-history
const getHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await WatchHistory.find({ userId: req.user.id })
      .sort({ watchedAt: -1 })
      .limit(limit);
    return res.json({ success: true, data: { history } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/watch-history/:videoId
const removeFromHistory = async (req, res) => {
  try {
    await WatchHistory.findOneAndDelete({
      userId: req.user.id,
      videoId: req.params.videoId,
    });
    return res.json({ success: true, message: "Removed from history" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/watch-history/clear
const clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ userId: req.user.id });
    return res.json({ success: true, message: "History cleared" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToHistory, getHistory, removeFromHistory, clearHistory };
