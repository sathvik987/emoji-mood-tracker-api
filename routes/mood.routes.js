const express = require('express');
const router = express.Router();
const mood = require('../controllers/mood.controller');
const { authenticateToken } = require('../controllers/helper.util');

router.post('/', authenticateToken, mood.add);
router.put('/:id', authenticateToken, mood.update);
router.delete('/:id', authenticateToken, mood.deleteMood);
router.get('/monthly-summary', authenticateToken, mood.getMonthlySummary);
router.get('/filter', authenticateToken, mood.getByFilter);

module.exports = router;