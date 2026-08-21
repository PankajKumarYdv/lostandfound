const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // URLs or paths to images
  }],
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "claimed"],
    default: "available",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
