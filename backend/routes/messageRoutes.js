const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.route("/:claimId")
  .get(protect, getMessages)
  .post(protect, upload.single("image"), sendMessage);

module.exports = router;
