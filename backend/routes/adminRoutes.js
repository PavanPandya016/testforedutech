const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getStats, getUsers, updateUser, deleteUser, getEntities, deleteEntity } = require('../controllers/adminController');

// All admin routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/entities/:type', getEntities);
router.delete('/entities/:type/:id', deleteEntity);

module.exports = router;
