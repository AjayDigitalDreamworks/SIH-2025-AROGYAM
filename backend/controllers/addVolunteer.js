const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


router.addVolunteer = async (req, res) => {
  const counsellor = req.user;

  if (counsellor.role !== 'counsellor') {
    return res.status(403).json({ error: 'Only counsellors can add volunteers' });
  }

  const { display_name, email, password, phone, canCreateCommunity } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const volunteer = await Volunteer.create({
      volunteerId: crypto.randomUUID(),
      display_name,
      email,
      password: hashedPassword,
      phone,
      canCreateCommunity: canCreateCommunity || false,
    });

    res.status(201).json({
      message: 'Volunteer created successfully',
      volunteer: {
        display_name: volunteer.display_name,
        email: volunteer.email,
        canCreateCommunity: volunteer.canCreateCommunity
      }
    });
  } catch (err) {
    console.error('Add Volunteer Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = router;