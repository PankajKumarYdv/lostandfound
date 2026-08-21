const express = require("express");
const { getItems, getItemById, createItem, getMyItems } = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getItems);
router.get("/my-items", protect, getMyItems);
router.get("/:id", getItemById);
router.post("/", protect, upload.array("images", 3), createItem);

module.exports = router;
