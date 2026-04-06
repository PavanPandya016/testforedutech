const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, logout, getProfile, updateProfile, submitApplication } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.post('/apply', protect, submitApplication);

module.exports = router;