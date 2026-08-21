const Claim = require("../models/Claim");
const Item = require("../models/Item");
const User = require("../models/User");

// @desc    Submit a claim for an item
// @route   POST /api/claims
// @access  Private
const submitClaim = async (req, res) => {
  try {
    const { itemId, proofDetails } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status === "claimed") {
      return res.status(400).json({ message: "Item is already claimed" });
    }

    // Handle optional proof files
    let proofFiles = [];
    if (req.files && req.files.length > 0) {
      proofFiles = req.files.map(file => `/uploads/${file.filename}`);
    }

    const claim = new Claim({
      itemId,
      claimantId: req.user._id,
      proofDetails,
      proofFiles,
      reviewedBy: item.createdBy,
    });

    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get claims for an item (only if user is the finder)
// @route   GET /api/claims/:itemId
// @access  Private
const getItemClaims = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Ensure the requester is the person who posted the item
    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to view claims for this item" });
    }

    const claims = await Claim.find({ itemId: req.params.itemId }).populate("claimantId", "name email");
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or reject a claim
// @route   PATCH /api/claims/:id/status
// @access  Private
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"

    const claim = await Claim.findById(req.params.id).populate("itemId");
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Ensure only the finder can update status
    if (claim.reviewedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this claim" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Claim status is already decided" });
    }

    claim.status = status;
    await claim.save();

    if (status === "accepted") {
      // Mark item as claimed
      await Item.findByIdAndUpdate(claim.itemId._id, { status: "claimed" });

      // Reward the finder with honesty points (e.g., 10 points)
      const finder = await User.findById(claim.reviewedBy);
      finder.honestyScore += 10;
      await finder.save();

      // Reject all other pending claims for this item
      await Claim.updateMany(
        { itemId: claim.itemId._id, _id: { $ne: claim._id } },
        { $set: { status: "rejected" } }
      );
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all claims submitted by the current user
// @route   GET /api/claims/my-claims
// @access  Private
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user._id })
      .populate("itemId", "title images status category")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitClaim, getItemClaims, updateClaimStatus, getMyClaims };
