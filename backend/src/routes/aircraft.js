const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft
} = require('../controllers/aircraftController');

// Public routes
router.get('/', getAllAircraft);
router.get('/:id', getAircraftById);

// Protected routes - CU auth
router.post('/', auth, createAircraft);
router.put('/:id', auth, updateAircraft);
router.delete('/:id', auth, deleteAircraft);

module.exports = router;