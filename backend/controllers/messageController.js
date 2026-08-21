const Message = require("../models/Message");
const Claim = require("../models/Claim");

// @desc    Get all messages for a specific claim
// @route   GET /api/messages/:claimId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Verify user is either claimant or finder
    if (claim.claimantId.toString() !== req.user._id.toString() && claim.reviewedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to view this chat" });
    }

    const messages = await Message.find({ claimId: req.params.claimId })
                                  .populate("sender", "name email")
                                  .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in a claim chat (with optional photo)
// @route   POST /api/messages/:claimId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validate if the user is authorized for this claim
    const claim = await Claim.findById(req.params.claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.claimantId.toString() !== req.user._id.toString() && claim.reviewedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to send messages in this chat" });
    }

    // Handle optional image upload from multer
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!content && !imageUrl) {
      return res.status(400).json({ message: "Message must contain either text or an image." });
    }

    let message = new Message({
      claimId: req.params.claimId,
      sender: req.user._id,
      content: content || "",
      image: imageUrl
    });

    const populatedMessage = await message.save().then(t => t.populate("sender", "name email"));

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage };
