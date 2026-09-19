const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "movie" },
    thumbnail: { type: String },
    gradient: { type: String },
    emoji: { type: String },
    meta: { type: String },
    progress: { type: Number, default: 0 }, // seconds watched
    duration: { type: Number, default: 0 }, // total duration
    percent: { type: Number, default: 0 }, // 0-100
    completed: { type: Boolean, default: false },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

watchHistorySchema.index({ userId: 1, watchedAt: -1 });
watchHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model("WatchHistory", watchHistorySchema);
