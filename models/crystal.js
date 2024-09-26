const mongoose = require("mongoose");

// SCHEMA
const crystalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  colour: { type: String, required: true },
  image: { type: String, unique: true },
});

// MODEL
const Crystal = mongoose.model("Crystal", crystalSchema);

module.exports = Crystal;
