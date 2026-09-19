const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "movie" },
    gradient: { type: String },
    emoji: { type: String },
    meta: { type: String },
    rating: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, addedAt: -1 });
favoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
