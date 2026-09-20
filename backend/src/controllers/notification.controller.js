const Notification = require("../models/Notification");

// GET /api/v1/notifications
const getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    return res.json({ success: true, data: { notifications, unreadCount } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true },
    );
    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/notifications/:id/read
const markRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
    );
    return res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/notifications (internal use)
const createNotification = async (
  userId,
  title,
  message,
  type = "system",
  icon = "fa-bell",
  color = "var(--accent-soft)",
  iconColor = "var(--accent)",
) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      icon,
      color,
      iconColor,
    });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
  }
};

module.exports = {
  getNotifications,
  markAllRead,
  markRead,
  createNotification,
};
