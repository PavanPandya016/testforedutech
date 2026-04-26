const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { 
  getStats, getPublicStats, getUsers, updateUser, deleteUser, getEntities, 
  deleteEntity, updateEntity, getEntityById, createEntity,
  getEventParticipants, createUser, getApplications, updateApplicationStatus,
  getHomeData
} = require('../controllers/adminController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// All admin routes are protected and require admin role
router.use((req, res, next) => {
  console.log(`[AdminRoutes] HIT: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/public-stats', cacheMiddleware(300), getPublicStats);
// Combined home data: settings + featured courses + instructors + stats in one call
router.get('/home-data', cacheMiddleware(120), getHomeData);

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/participants/event/:id', getEventParticipants);
router.get('/applications', getApplications);
router.put('/applications/:id', updateApplicationStatus);
router.get('/entities/list/:type', getEntities);
router.get('/entities/get/:type/:id', getEntityById);
router.post('/entities/create/:type', createEntity);
router.delete('/entities/delete/:type/:id', deleteEntity);
router.put('/entities/update/:type/:id', updateEntity);

module.exports = router;
