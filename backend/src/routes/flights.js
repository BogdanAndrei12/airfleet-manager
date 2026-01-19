const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
} = require('../controllers/flightsController');

// Public routes
router.get('/', getAllFlights);
router.get('/:id', getFlightById);

// Protected routes
router.post('/', auth, createFlight);
router.put('/:id', auth, updateFlight);
router.delete('/:id', auth, deleteFlight);

module.exports = router;