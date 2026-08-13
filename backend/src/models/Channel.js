const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    logo: { type: String },
    banner: { type: String },
    streamUrl: { type: String, required: true },
    category: { type: String },
    language: { type: String, default: "en" },
    country: { type: String },
    isActive: { type: Boolean, default: true },
    isFree: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    tags: [{ type: String }],
    epgId: { type: String }, // for Electronic Program Guide
    createdBy: { type: String },
  },
  { timestamps: true },
);

channelSchema.index({ name: "text" });
channelSchema.index({ category: 1, isActive: 1 });
channelSchema.index({ sortOrder: 1 });

module.exports = mongoose.model("Channel", channelSchema);
