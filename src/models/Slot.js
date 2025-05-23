
// Slot model schema
const mongoose = require('mongoose');

const { Schema } = mongoose;

const slotSchema = new mongoose.Schema({
  slotid: {
    type: String,
    required: true
  },
  slotdate: {
    type: String,
    required: true
  },
  slotstatus: {
    type: String,
    enum: ['available', 'booked', 'cancelled'],
    default: 'available'
  },
  slotcount:{
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Update timestamp on save 
slotSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('Slot', slotSchema);
