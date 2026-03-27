const express = require('express');
const router = express.Router();
const { getInstructors } = require('../controllers/instructorController');

// All public instructor routes
router.get('/', getInstructors);

module.exports = router;
