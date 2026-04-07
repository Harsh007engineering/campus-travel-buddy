require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // We need this to talk to our Frontend later

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allows the frontend to talk to the backend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.log('Database connection error: ', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

app.get('/', (req, res) => {
    res.send('Campus Travel Buddy API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});