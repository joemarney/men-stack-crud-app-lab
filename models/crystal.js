const mongoose = require("mongoose");

// SCHEMA
const crystalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  colour: { type: String, required: true },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// MODEL
const Crystal = mongoose.model("Crystal", crystalSchema);

module.exports = Crystal;
