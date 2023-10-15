const express = require('express');
const router = express.Router();
const statistics = require('../controllers/statistics.controller');

router.get('/emoji-statistics', statistics.getEmojiStatistics);

module.exports = router;