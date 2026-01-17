const { db } = require('../config/firebase');

const flightsCollection = db.collection('flights');

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const snapshot = await flightsCollection.get();
    const flights = [];
    
    snapshot.forEach(doc => {
      flights.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single flight
const getFlightById = async (req, res) => {
  try {
    const doc = await flightsCollection.doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create flight
const createFlight = async (req, res) => {
  try {
    const flightData = {
      ...req.body,
      timestamps: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
    
    const docRef = await flightsCollection.add(flightData);
    
    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...flightData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update flight
const updateFlight = async (req, res) => {
  try {
    const flightData = {
      ...req.body,
      'timestamps.updated': new Date().toISOString()
    };
    
    await flightsCollection.doc(req.params.id).update(flightData);
    
    res.json({
      success: true,
      data: {
        id: req.params.id,
        ...flightData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete flight
const deleteFlight = async (req, res) => {
  try {
    await flightsCollection.doc(req.params.id).delete();
    
    res.json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
};