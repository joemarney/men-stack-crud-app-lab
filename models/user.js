const mongoose = require("mongoose");

// SCHEMA
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// MODEL
const User = mongoose.model("User", userSchema);

module.exports = User;
