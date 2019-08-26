const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// Create Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  cart:{
    type: [Object],
    default: []
  }
},
  {
    timestamps: true
  });

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

module.exports = User = mongoose.model("User", UserSchema);

// Get User
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

// Add User Cart
module.exports.addCart = (id, cart, options, callback) => {
  var query = { _id: id };
  
  var update = {cart};

  User.findOneAndUpdate(query, update, options, callback);
};