const express = require('express');
const router = express.Router();
const { createMessage } = require('../controllers/messageController');

// Message routes
router.post('/contact', createMessage); // Public: POST /api/contact

module.exports = router;