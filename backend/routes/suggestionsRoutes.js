const express = require('express');
const router = express.Router();
const { Suggestions } = require('../models'); // Presupunând că ai exportat modelele Sequelize așa
const passport = require('passport');
const authenticateJWT = passport.authenticate('jwt', { session: false }); // Middleware pentru autentificare, dacă este necesar

// Ruta pentru adăugarea unei noi sugestii
router.post('/suggestions', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id_user; // Presupunem că ID-ul utilizatorului este disponibil prin middleware-ul de autentificare
    const { suggestionText } = req.body; // Extrage textul sugestiei din corpul cererii

    // Verifică dacă textul sugestiei a fost furnizat
    if (!suggestionText) {
      return res.status(400).send({ message: 'Suggestion text is required.' });
    }

    // Creează o nouă sugestie în baza de date
    const suggestion = await Suggestions.create({
      suggestionText: suggestionText,
      userId_suggestion: userId,
      status: 'pending' // Starea implicită, poate fi omis dacă ai setat defaultValue în model
    });

    // Răspunde cu sugestia adăugată
    res.status(201).send(suggestion);
  } catch (error) {
    console.error('Error adding suggestion:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
