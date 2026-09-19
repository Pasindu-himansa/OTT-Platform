const Favorite = require("../models/Favorite");

// GET /api/v1/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({
      addedAt: -1,
    });
    return res.json({ success: true, data: { favorites } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/favorites
const addFavorite = async (req, res) => {
  try {
    const { videoId, title, type, gradient, emoji, meta, rating } = req.body;

    const existing = await Favorite.findOne({ userId: req.user.id, videoId });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Already in favorites" });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
      videoId,
      title,
      type,
      gradient,
      emoji,
      meta,
      rating,
    });

    return res.status(201).json({ success: true, data: { favorite } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/favorites/:videoId
const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      videoId: req.params.videoId,
    });
    return res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/favorites/check/:videoId
const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user.id,
      videoId: req.params.videoId,
    });
    return res.json({ success: true, data: { isFavorite: !!favorite } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
