const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // ← Comentează
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

// Protected routes - FĂRĂ auth pentru demo
router.post('/', createAircraft);  // ← Fără auth
router.put('/:id', updateAircraft);  // ← Fără auth
router.delete('/:id', deleteAircraft);  // ← Fără auth

module.exports = router;