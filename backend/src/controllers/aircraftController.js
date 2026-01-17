const { db } = require('../config/firebase');

const aircraftCollection = db.collection('aircraft');

// Get all aircraft
const getAllAircraft = async (req, res) => {
  try {
    const snapshot = await aircraftCollection.get();
    const aircraft = [];
    
    snapshot.forEach(doc => {
      aircraft.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      count: aircraft.length,
      data: aircraft
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single aircraft
const getAircraftById = async (req, res) => {
  try {
    const doc = await aircraftCollection.doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Aircraft not found'
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

// Create aircraft
const createAircraft = async (req, res) => {
  try {
    const aircraftData = {
      ...req.body,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    const docRef = await aircraftCollection.add(aircraftData);
    
    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...aircraftData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update aircraft
const updateAircraft = async (req, res) => {
  try {
    const aircraftData = {
      ...req.body,
      'metadata.updatedAt': new Date().toISOString()
    };
    
    await aircraftCollection.doc(req.params.id).update(aircraftData);
    
    res.json({
      success: true,
      data: {
        id: req.params.id,
        ...aircraftData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete aircraft
const deleteAircraft = async (req, res) => {
  try {
    await aircraftCollection.doc(req.params.id).delete();
    
    res.json({
      success: true,
      message: 'Aircraft deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft
};