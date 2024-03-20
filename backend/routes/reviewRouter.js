const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticateJWT = passport.authenticate('jwt', { session: false });
const jwtSecret = 'your_jwt_secret';
const { Review, User, Meals, Desserts } = require('../models'); // Importăm modelele necesare


// Ruta pentru adăugarea unui review
router.post('/add', authenticateJWT, async (req, res) => {
  try {
    const { descriptionReview, userID_review, dessertID_review, mealID_review } = req.body;
    const newReview = await Review.create({
      descriptionReview,
      userID_review,
      dessertID_review,
      mealID_review
    });
    res.json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/review/:type/:id',authenticateJWT, async (req, res) => {
    const { type, id } = req.params; // 'type' poate fi 'dessert' sau 'meal'
    
    try {
      let reviews = [];
      if (type === 'dessert') {
        reviews = await Review.findAll({
          where: { dessertID_review: id },
          include: [
            {
              model: User,
              attributes: ['username'], // Preia doar username-ul user-ului care a lăsat review
            },
          ],
          attributes: ['descriptionReview'],
        });
      } else if (type === 'meal') {
        reviews = await Review.findAll({
          where: { mealID_review: id },
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
          attributes: ['descriptionReview'],
        });
      }
  
      if (reviews.length > 0) {
        res.json(reviews);
      } else {
        res.status(404).json({ message: 'No reviews found' });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/meals/names', authenticateJWT,async (req, res) => {
    try {
      const meals = await Meals.findAll({
        attributes: ['id_meal', 'name_meal'] // Selectăm id_meal și name_meal
      });
      res.json(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Ruta pentru a prelua numele tuturor deserturilor, adaptată la numele coloanelor din modelul Desserts
  router.get('/desserts/names',authenticateJWT, async (req, res) => {
    try {
      const desserts = await Desserts.findAll({
        attributes: ['id_dessert', 'name_dessert'] // Selectăm id_dessert și name_dessert
      });
      res.json(desserts);
    } catch (error) {
      console.error('Error fetching desserts:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;