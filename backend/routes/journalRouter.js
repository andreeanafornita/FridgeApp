// Într-un fișier numit reviewRoutes.js
const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const { expressjwt: jwt } = require('express-jwt');

// Middleware pentru autentificare
const jwtMiddleware = jwt({
    secret: 'your_jwt_secret',
    algorithms: ['HS256']
});

// Adăugare recenzie
router.post('/', jwtMiddleware, async (req, res) => {
    try {
        const review = await Review.create({
            descriptionReview: req.body.descriptionReview,
            userID_review: req.user.id, // Presupunem că ID-ul utilizatorului este inclus în payload-ul JWT
            dessertID_review: req.body.dessertID_review,
            mealID_review: req.body.mealID_review
        });
        return res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Obținere toate recenziile
router.get('/', async (req, res) => {
  try {
      const reviews = await Review.findAll();
      return res.json(reviews);
  } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});


// Ștergere recenzie
router.delete('/:id', jwtMiddleware, async (req, res) => {
  try {
      const review = await Review.findByPk(req.params.id);
      if (!review) {
          return res.status(404).json({ error: 'Review not found' });
      }
      await review.destroy();
      return res.status(204).send();
  } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});


  //edit
  // Actualizare recenzie
router.put('/:id', jwtMiddleware, async (req, res) => {
  try {
      const review = await Review.findByPk(req.params.id);
      if (!review) {
          return res.status(404).json({ error: 'Review not found' });
      }
      review.descriptionReview = req.body.descriptionReview || review.descriptionReview;
      await review.save();
      return res.json(review);
  } catch (error) {
      console.error("Error updating review:", error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

  module.exports = router;

  