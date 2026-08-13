const Channel = require("../models/Channel");

// GET /api/v1/channels
const getChannels = async (req, res) => {
  try {
    const { category, language, isFree, search } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (language) filter.language = language;
    if (isFree !== undefined) filter.isFree = isFree === "true";
    if (search) filter.$text = { $search: search };

    const channels = await Channel.find(filter).sort({ sortOrder: 1, name: 1 });
    return res.json({ success: true, data: { channels } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/channels/:id
const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel || !channel.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }
    return res.json({ success: true, data: { channel } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/channels  (admin/content_manager)
const createChannel = async (req, res) => {
  try {
    const channel = await Channel.create({
      ...req.body,
      createdBy: req.user.id,
    });
    return res
      .status(201)
      .json({ success: true, message: "Channel created", data: { channel } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/channels/:id  (admin/content_manager)
const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }
    return res.json({
      success: true,
      message: "Channel updated",
      data: { channel },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/channels/:id  (admin)
const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }
    return res.json({ success: true, message: "Channel deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
};
