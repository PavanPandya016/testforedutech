const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { 
  getStats, getUsers, updateUser, deleteUser, getEntities, 
  deleteEntity, updateEntity, getEntityById, createEntity,
  getEventParticipants, createUser
} = require('../controllers/adminController');

// All admin routes are protected and require admin role
router.use((req, res, next) => {
  console.log(`[AdminRoutes] HIT: ${req.method} ${req.originalUrl}`);
  next();
});

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/participants/event/:id', getEventParticipants);
router.get('/entities/list/:type', getEntities);
router.get('/entities/get/:type/:id', getEntityById);
router.post('/entities/create/:type', createEntity);
router.delete('/entities/delete/:type/:id', deleteEntity);
router.put('/entities/update/:type/:id', updateEntity);

module.exports = router;
