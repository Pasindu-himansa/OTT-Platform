const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["movie", "series", "episode", "live"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    thumbnail: { type: String },
    banner: { type: String },
    streamUrl: { type: String },
    trailerUrl: { type: String },
    duration: { type: Number, default: 0 }, // seconds
    quality: { type: String, enum: ["SD", "HD", "FHD", "4K"], default: "HD" },

    // For series
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    season: { type: Number },
    episode: { type: Number },

    // Meta
    genre: [{ type: String }],
    tags: [{ type: String }],
    language: { type: String, default: "en" },
    releaseYear: { type: Number },
    rating: { type: String }, // PG, PG-13, R etc
    cast: [{ name: String, role: String }],
    director: { type: String },

    // Stats
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    // Access
    isFree: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: true },

    categories: [{ type: String }],
    createdBy: { type: String }, // User UUID
  },
  { timestamps: true },
);

videoSchema.index({ title: "text", description: "text", tags: "text" });
videoSchema.index({ type: 1, status: 1 });
videoSchema.index({ categories: 1 });
videoSchema.index({ genre: 1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ views: -1 });

module.exports = mongoose.model("Video", videoSchema);
