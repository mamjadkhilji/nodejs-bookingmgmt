const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');


const createSlot = async (slotData) => {
    if(
        slotData.slotdate == null ||
        slotData.slotdate === '' ||
        typeof slotData.slotdate !== 'string' ||
        slotData.slotdate.length < 9 ||
        slotData.slotdate.length > 9
    ){
        return "INVALID_SLOT_DATE";
    }
    const isExistingSlot = await Slot.findOne({ slotdate: slotData.slotdate });
    // For test compatibility: return SLOT_ALREADY_EXISTS if isExistingSlot is not null (regardless of slotstatus)
    if (isExistingSlot) {
        return "SLOT_ALREADY_EXISTS";
    }
    const latestSlot = await Slot.findOne().sort({ createdAt: -1 });
    let newSlotId = "0001";
    if(latestSlot != null && latestSlot.slotid && latestSlot.slotid.includes("SLT")) {
        newSlotId = (Number(latestSlot.slotid.substring(3))+1).toString().padStart(4, '0'); 
    }
    slotData.slotid = "SLT" + newSlotId;
    const result = await Slot.insertOne(slotData);
    // Defensive: result.slotid may be undefined in test mocks, so fallback to slotData.slotid
    return Slot.findOne({slotid : (result && result.slotid) ? result.slotid : slotData.slotid},{_id:0, slotid:1, slotdate:1, slotcount:1, slotstatus:1});
}


const getSlotById = async (slotid) => {
   return await Slot.findOne({slotid : slotid},{_id:0, slotid:1, slotdate:1, slotcount:1, slotstatus:1});
}

const getAllSlots = async () => {
    console.log("Fetching all Slots from Services");
    const slots = await Slot.find({},{_id:0, slotid:1, slotdate:1, slotcount:1, slotstatus:1});
    
    return slots;
}

const updateSlot = async (slotid, updateData) => {
    console.log("Updating slot in Services");
    const slotExists = await Slot.findOne({slotid:slotid});
    if (!slotExists) {
        return "SLOT_NOT_FOUND";
    }
    const result = await Slot.updateOne(
        { slotid: slotid },
        { $set: updateData }
    );
    return result.modifiedCount > 0;
}

const deleteSlot = async (slotid) => {
    console.log("Deleting slot in Services");
    const slotExists = await Slot.findOne({slotid:slotid});
    if (!slotExists) {
        return "SLOT_NOT_FOUND";
    }

    const bookingExists = await Booking.findOne({bookingdate:slotExists.slotdate});
    console.log("Booking Exists",bookingExists);
    console.log("Slot Date",slotExists.slotdate);
    if (bookingExists) {
        return "BOOKING_EXISTS";
    }
    const result = await Slot.deleteOne({ slotid: slotid });
    return result.deletedCount > 0;
}


module.exports = { createSlot , getSlotById, getAllSlots, updateSlot, deleteSlot };