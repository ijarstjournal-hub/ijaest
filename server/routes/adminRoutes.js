const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Strict rate limit for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

// ── POST /api/admin/setup ─────────────────────────────────────────────────────
// One-time admin creation – requires ADMIN_SETUP_KEY env var in body
router.post('/setup', async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: 'Invalid setup key.' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await Admin.findOne({});
    if (existing) {
      return res.status(409).json({ message: 'An admin account already exists.' });
    }

    const admin = new Admin({ email: email.toLowerCase().trim(), password });
    await admin.save();

    res.status(201).json({ message: 'Admin account created successfully.' });
  } catch (err) {
    console.error('Setup error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Server error during setup.' });
  }
});

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Use constant-time comparison to prevent timing attacks
    const isMatch = admin ? await admin.comparePassword(password) : false;

    if (!admin || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      email: admin.email,
      message: 'Login successful.',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ── POST /api/admin/logout ────────────────────────────────────────────────────
// Client-side only – server just returns 200 to confirm receipt
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out. Please clear your local token.' });
});

// ── GET /api/admin/me ─────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  res.json({ email: req.admin.email });
});

module.exports = router;
