const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bookingsystem');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}; 

const closeConnection = async () => {
    await mongoose.connection.close();
}

module.exports = { connectDB, closeConnection };