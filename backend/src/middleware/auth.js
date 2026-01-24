const { admin } = require('../config/firebase');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login first.'
      });
    }
    
    // Verifica token cu Firebase Admin
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

module.exports = auth;