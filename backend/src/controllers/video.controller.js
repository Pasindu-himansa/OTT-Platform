const Video = require("../models/Video");

// GET /api/v1/videos
const getVideos = async (req, res) => {
  try {
    const {
      type,
      status = "published",
      category,
      genre,
      language,
      isFree,
      search,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    const filter = { status };
    if (type) filter.type = type;
    if (category) filter.categories = category;
    if (genre) filter.genre = genre;
    if (language) filter.language = language;
    if (isFree !== undefined) filter.isFree = isFree === "true";
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortField = sort.startsWith("-")
      ? { [sort.slice(1)]: -1 }
      : { [sort]: 1 };

    const [videos, total] = await Promise.all([
      Video.find(filter).sort(sortField).skip(skip).limit(parseInt(limit)),
      Video.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        videos,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/videos/:id
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    // Increment view count
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    return res.json({ success: true, data: { video } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/videos/series/:seriesId/episodes
const getEpisodes = async (req, res) => {
  try {
    const episodes = await Video.find({
      seriesId: req.params.seriesId,
      type: "episode",
      status: "published",
    }).sort({ season: 1, episode: 1 });

    return res.json({ success: true, data: { episodes } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/videos/trending
const getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await Video.find({ status: "published" })
      .sort({ views: -1 })
      .limit(limit);
    return res.json({ success: true, data: { videos } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/videos  (admin/content_manager)
const createVideo = async (req, res) => {
  try {
    const video = await Video.create({ ...req.body, createdBy: req.user.id });
    return res
      .status(201)
      .json({ success: true, message: "Video created", data: { video } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/videos/:id  (admin/content_manager)
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    return res.json({
      success: true,
      message: "Video updated",
      data: { video },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/videos/:id  (admin)
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    return res.json({ success: true, message: "Video deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const path = require("path");

// POST /api/v1/videos/upload
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { title, type, description, releaseYear, genre, isFree } = req.body;
    const streamUrl = `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`;

    const video = await Video.create({
      title: title || req.file.originalname,
      type: type || "movie",
      description: description || "",
      releaseYear: parseInt(releaseYear) || new Date().getFullYear(),
      genre: genre ? [genre] : [],
      isFree: isFree === "true",
      isPremium: isFree !== "true",
      status: "published",
      streamUrl,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: { video, streamUrl },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  getEpisodes,
  getTrending,
  createVideo,
  updateVideo,
  deleteVideo,
  uploadVideo,
};
