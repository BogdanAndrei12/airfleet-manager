const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aircraftRoutes = require('./routes/aircraft');
const flightsRoutes = require('./routes/flights');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ruta de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'AirFleet Manager API is running',
    version: '1.0.0',
    endpoints: {
      aircraft: '/api/aircraft',
      flights: '/api/flights'
    }
  });
});

// API Routes
app.use('/api/aircraft', aircraftRoutes);
app.use('/api/flights', flightsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});