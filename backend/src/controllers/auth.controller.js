const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { set, get, del } = require("../config/redis");

// POST /api/v1/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB and Redis (30d TTL)
    await user.update({ refreshToken, lastLoginAt: new Date() });
    await set(`refresh:${user.id}`, refreshToken, 60 * 60 * 24 * 30);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.update({ refreshToken, lastLoginAt: new Date() });
    await set(`refresh:${user.id}`, refreshToken, 60 * 60 * 24 * 30);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const cached = await get(`refresh:${decoded.id}`);

    if (!cached || cached !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await user.update({ refreshToken: newRefreshToken });
    await set(`refresh:${user.id}`, newRefreshToken, 60 * 60 * 24 * 30);

    return res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      await del(`refresh:${decoded.id}`);
      const user = await User.findByPk(decoded.id);
      if (user) await user.update({ refreshToken: null });
    }

    return res.json({ success: true, message: "Logged out successfully" });
  } catch {
    return res.json({ success: true, message: "Logged out" });
  }
};

// GET /api/v1/auth/me
const me = async (req, res) => {
  return res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
        lastLoginAt: req.user.lastLoginAt,
        createdAt: req.user.createdAt,
      },
    },
  });
};

module.exports = { register, login, refresh, logout, me };
