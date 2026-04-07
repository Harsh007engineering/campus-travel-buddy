const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;

    // 1. THE VIT BOUNCER: Check if it's a valid college email
    if (!email.endsWith('@vitapstudent.ac.in')) {
        return res.status(400).json({ message: "Only @vitapstudent.ac.in emails are allowed!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save the new user with their phone number
        const newUser = new User({ name, email, password: hashedPassword, phone });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during signup" });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // We send back the user data (including phone) so the frontend can use it
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;