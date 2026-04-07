const express = require('express');
const Trip = require('../models/Trip');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied" });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

router.post('/create', verifyToken, async (req, res) => {
    try {
        const newTrip = new Trip({ ...req.body, creator: req.user.id });
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('creator', 'name email phone')
            .populate('passengers', 'name email phone');
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/join/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        if (trip.availableSeats <= 0) return res.status(400).json({ message: "Trip is full!" });
        if (trip.creator.toString() === req.user.id) return res.status(400).json({ message: "You cannot join your own trip!" });
        if (trip.passengers.includes(req.user.id)) return res.status(400).json({ message: "You already joined this trip!" });

        trip.passengers.push(req.user.id);
        trip.availableSeats -= 1;
        await trip.save();
        res.status(200).json({ message: "Successfully joined the trip!" });
    } catch (err) {
        res.status(500).json({ message: "Server error while joining trip" });
    }
});

// NEW: LEAVE A TRIP (Cancel Seat)
router.post('/leave/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        // Check if the user is actually in the passengers list
        if (!trip.passengers.includes(req.user.id)) {
            return res.status(400).json({ message: "You are not a passenger on this trip!" });
        }

        // Remove the user from the passengers array
        trip.passengers = trip.passengers.filter(passengerId => passengerId.toString() !== req.user.id);
        
        // Give the seat back!
        trip.availableSeats += 1;
        
        await trip.save();
        res.status(200).json({ message: "You have left the trip." });
    } catch (err) {
        res.status(500).json({ message: "Server error while leaving trip" });
    }
});

router.put('/edit/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        if (trip.creator.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized to edit this trip" });

        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(500).json({ message: "Server error while editing" });
    }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        if (trip.creator.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized to delete this trip" });

        await trip.deleteOne();
        res.status(200).json({ message: "Trip deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error while deleting" });
    }
});

module.exports = router;