const User = require("../models/User");

// @desc    Get top users by honesty score
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ honestyScore: -1 })
      .limit(10)
      .select("name honestyScore"); // Only return name and score for ranking

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
