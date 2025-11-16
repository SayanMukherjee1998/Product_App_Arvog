const User = require("../models/User");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/tokenUtil");
const { saveRefreshToken, getRefreshToken, deleteRefreshToken } = require("../utils/refreshStore");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success:false, message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    user.password = undefined;
    res.status(201).json({ success:true, user });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // save refresh token (in-memory store or DB)
    saveRefreshToken(user._id, refreshToken);

    // send refresh token as httpOnly cookie (optional) and access token in body
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    // prefer cookie, fallback to body
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success:false, message: "No refresh token provided" });

    // verify signature
    const payload = verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ success:false, message: "Invalid refresh token" });

    // check store
    const stored = getRefreshToken(payload.id);
    if (stored !== token) return res.status(401).json({ success:false, message: "Refresh token revoked" });

    const newAccess = signAccessToken({ id: payload.id, role: payload.role });
    const newRefresh = signRefreshToken({ id: payload.id, role: payload.role });

    saveRefreshToken(payload.id, newRefresh);

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({ success:true, accessToken: newAccess });
  } catch (err) {
    res.status(401).json({ success:false, message: "Refresh failed", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(400).json({ success:false, message: "No token" });

    const payload = verifyRefreshToken(token);
    if (payload) deleteRefreshToken(payload.id);

    res.clearCookie("refreshToken");
    res.json({ success:true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};
