const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const { authenticateToken } = require('../controllers/helper.util');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/toggle-sharing', authenticateToken, user.toggleSharing);


module.exports = router;