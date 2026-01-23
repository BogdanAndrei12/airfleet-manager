const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // ← Comentează
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

// Protected routes - FĂRĂ auth pentru demo
router.post('/', createFlight);  // ← Fără auth
router.put('/:id', updateFlight);  // ← Fără auth
router.delete('/:id', deleteFlight);  // ← Fără auth

module.exports = router;