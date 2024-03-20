// authUtils.js
const jwt = require('jsonwebtoken');

function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Înlocuiește cu cheia ta secretă reală
    return decoded.id_user; // Presupunem că id_user este cheia din tokenul JWT care conține userId-ul
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

module.exports = { getUserIdFromToken };
