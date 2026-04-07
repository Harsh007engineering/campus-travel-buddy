const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    source: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    availableSeats: { type: Number, required: true },
    costPerPerson: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // NEW: Keep track of who joined!
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

module.exports = mongoose.model('Trip', TripSchema);