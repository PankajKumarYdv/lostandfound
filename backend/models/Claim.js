const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  claimantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proofDetails: {
    type: String,
    required: true, // Details like serial number, marks, etc.
  },
  proofFiles: [{
    type: String, // Optional uploaded files for proof
  }],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // This is the user who posted the item
  },
}, {
  timestamps: true,
});

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
