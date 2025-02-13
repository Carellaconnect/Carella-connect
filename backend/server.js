const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://carellaconnect:<db_password>@carellaconnect.h50ep.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Carella Connect Backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; // Update this if running on a server
    console.log(`Server running at ${baseURL}`);
});