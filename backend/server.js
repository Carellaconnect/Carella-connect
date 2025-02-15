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

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Carella Connect Backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; 
    console.log(`Server running at ${baseURL}`);
});