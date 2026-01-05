const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'yadavji06';

// Signup Route
router.post('/signup', async (req, res) => {
  // Log request details for debugging
  console.log('POST /api/auth/signup - incoming request', {
    body: req.body,
    ip: req.ip,
    origin: req.headers.origin || req.headers.referer || null,
  });

  try {
    const { username, fullName, email, phone, password, avatar, university, yearOfStudy } = req.body;

    // Basic required fields validation
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields: username, fullName, email or password' });
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }

    // Create new user
    const user = new User({ username, fullName, email, phone, password, avatar, university, yearOfStudy });
    console.log('Attempting to save user to DB', { username: user.username, email: user.email, yearOfStudy: user.yearOfStudy });
    try {
      await user.save();
      console.log('User saved successfully', { id: user._id });
    } catch (saveErr) {
      console.error('Error saving user to DB:', saveErr);
      // If validation error or duplicate, rethrow to be handled by outer catch
      throw saveErr;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, fullname: user.fullName, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Signup error (detailed):', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }

    // Duplicate key error
    if (error.code === 11000) {
      const dupField = Object.keys(error.keyPattern || {}).join(', ');
      return res.status(409).json({ message: `Duplicate field: ${dupField}` });
    }

    // In development, return stack to help debugging
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: error.message, stack: error.stack });
    }

    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email or Password missing' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ userId: user._id, email: user.email, fullname: user.fullName,username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send token as a response
  res.json({ token });
    // Generate JWT token
    // const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // // Set the token in a cookie (httpOnly, secure, sameSite)
    // res.cookie('token', token, {
    //   httpOnly: true,      // Cannot be accessed by JavaScript
    //   secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    //   sameSite: 'None',  // Prevents sending the cookie on cross-site requests
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });

    // res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract the token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;  // Attach decoded user data to the request
    next();
  });
};


// Example protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

// Logout Route: clears cookie-based token (if used)
router.post('/logout', (req, res) => {
  try {
    // Clear cookie if token stored in cookie
    res.clearCookie && res.clearCookie('token');
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error', err);
    res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;
