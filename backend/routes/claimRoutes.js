const express = require("express");
const { submitClaim, getItemClaims, updateClaimStatus, getMyClaims } = require("../controllers/claimController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.array("proofFiles", 3), submitClaim);
router.get("/my-claims", protect, getMyClaims);
router.get("/:itemId", protect, getItemClaims);
router.patch("/:id/status", protect, updateClaimStatus);

module.exports = router;
