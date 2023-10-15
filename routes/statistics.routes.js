const express = require('express');
const router = express.Router();
const statistics = require('../controllers/statistics.controller');

router.get('/emoji-statistics', statistics.getEmojiStatistics);
router.get('/mood-trends', statistics.getMoodTrends);
router.get('/public-mood-board', statistics.getPublicMoodBoardData);

module.exports = router;