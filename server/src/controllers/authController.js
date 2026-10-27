const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Helper to generate token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide displayName, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      displayName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user'
    });

    const token = generateToken(user._id, user.role);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
exports.getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl,
      bio: req.user.bio,
      createdAt: req.user.createdAt
    }
  });
};
