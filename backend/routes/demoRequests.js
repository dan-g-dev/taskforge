const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// POST /api/demo-requests - public lead-capture form from the landing page.
// No auth required: this runs before anyone has an account.
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, teamSize, useCase } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'name and email are required' });
  }

  await pool.query(
    'INSERT INTO demo_requests (name, email, phone, team_size, use_case) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, teamSize || null, useCase || null]
  );

  res.status(201).json({ success: true, message: 'Demo request received' });
}));

module.exports = router;
