const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Slot = require('../models/Slot');
const { DateTime } = require('luxon');


const createBooking = async (userLogin,bookingData) => {
    const user = await User.findOne({ userid: userLogin });
    if (!user) {
        return "USER_NOT_FOUND";
    }
    const isExistingBooking = await Booking.findOne({ bookingdate: bookingData.bookingdate, userloginid: userLogin});
    if (isExistingBooking) {
        return "BOOKING_ALREADY_EXISTS";
    }
    let isExistingSlot = await Slot.findOne({ slotdate: bookingData.bookingdate });
    if(!isExistingSlot) {
        return "SLOT_NOT_FOUND";
    }
    const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
    let newBookingId = "0001";
    if(latestBooking != null && latestBooking.bookingid.includes("BKG")) {
        newBookingId = (Number(latestBooking.bookingid.substring(3))+1).toString().padStart(4, '0'); 
    }
    bookingData.userid = user._id;
    bookingData.userloginid = user.userid;
    bookingData.bookingid = "BKG" + newBookingId;
    const result = await Booking.insertOne(bookingData);
    const updatedSlotCount = Number(isExistingSlot.slotcount) - 1;
    isExistingSlot.slotcount = updatedSlotCount;
    await Slot.updateOne({ slotdate: bookingData.bookingdate }, { $set: isExistingSlot });
    return Booking.findOne({bookingid : result.bookingid},{_id:0, bookingid:1, userloginid:1, bookingdate:1, status:1});
}


const getBookingById = async (userLogin,bookingId) => {
   // return await Booking.findOne({ _id: new ObjectId(bookingId) });
   return await Booking.findOne({bookingid : bookingId, userloginid:userLogin},{_id:0, bookingid:1, userloginid:1, bookingdate:1, status:1});
}

const getAllBookings = async (userLogin) => {
    console.log("Fetching all bookings from Services");
    const bookings = await Booking.find({userloginid:userLogin},{_id:0, bookingid:1, userloginid:1, bookingdate:1, status:1});
    
    return bookings;
}

const updateBooking = async (userLogin,bookingId, updateData) => {
    console.log("Updating booking in Services");
    const bookingExists = await Booking.findOne({bookingid:bookingId, userloginid:userLogin});
    if (!bookingExists) {
        return "BOOKING_NOT_FOUND";
    }
    if(!(!updateData.bookingdate || updateData.bookingdate == "")){
    let isExistingSlot = await Slot.findOne({ slotdate: updateData.bookingdate });
    if(!isExistingSlot) {
        return "SLOT_NOT_FOUND";
    }
    }
    const result = await Booking.updateOne(
        { bookingid: bookingId, userloginid:userLogin },
        { $set: updateData }
    );
    return result.modifiedCount > 0;
}

const patchBooking = async (userLogin,bookingId, updateData) => {
    console.log("Patching booking in Services");
    const bookingExists = await Booking.findOne({bookingid:bookingId, userloginid:userLogin}); 
    if (!bookingExists) {
        return "BOOKING_NOT_FOUND";
    }
    if(!(!updateData.bookingdate || updateData.bookingdate == "")){
    let isExistingSlot = await Slot.findOne({ slotdate: updateData.bookingdate });
    if(!isExistingSlot) {
        return "SLOT_NOT_FOUND";
    }
    }
    const result = await Booking.updateOne(
        { bookingid: bookingId },
        { $set: updateData }
    );
    return result.modifiedCount > 0;
}

const deleteBooking = async (userLogin, bookingId) => {
    console.log("Deleting booking in Services");
    const bookingExists = await Booking.findOne({bookingid:bookingId, userloginid:userLogin});
    if (!bookingExists) {
        return "BOOKING_NOT_FOUND";
    }
    let isExistingSlot = await Slot.findOne({ slotdate: bookingExists.bookingdate });
    const result = await Booking.deleteOne({ bookingid: bookingId });
    const updatedSlotCount = Number(isExistingSlot.slotcount) + 1;
    isExistingSlot.slotcount = updatedSlotCount;
    await Slot.updateOne({ slotdate: bookingExists.bookingdate, userloginid:userLogin }, { $set: isExistingSlot });
    return result.deletedCount > 0;
}


module.exports = { createBooking, getAllBookings, getBookingById, updateBooking,patchBooking, deleteBooking};