
const jwt = require('jsonwebtoken');

function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    return decoded.id_user; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

module.exports = { getUserIdFromToken };
