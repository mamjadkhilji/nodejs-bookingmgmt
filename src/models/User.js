
// User model schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String, 
    trim: true
  },
  passkey: {
    type: String,
  },
  email: {
    type: String,
  },
  usertype: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;