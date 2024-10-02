const mongoose = require("mongoose");

// SCHEMAS
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const crystalSchema = new mongoose.Schema({
  name: { type: String, required: ["Add a name", true], unique: true },
  description: { type: String, required: ["Add a description", true] },
  colour: { type: String, required: ["Add a colour", true] },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [commentSchema],
});

// MODEL
const Crystal = mongoose.model("Crystal", crystalSchema);

module.exports = Crystal;
