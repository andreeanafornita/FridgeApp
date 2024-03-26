const express = require('express');
const router = express.Router();
const { Meals, MealsXProducts, Products, ProductsXUser, User } = require('../models');
const passport = require('passport');
const { Sequelize } = require('sequelize');

const app = express();
app.use(passport.initialize()); 
app.use(express.json()); 

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret', 
    algorithms: ['HS256'],
};

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    User.findByPk(jwt_payload.id_user) 
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            return done(err, false);
        });
}));

const authenticateJWT = passport.authenticate('jwt', { session: false });

router.get('/generateMealFromProducts', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id_user;

    // Obținerea produselor utilizatorului cu units > 0
    const userProducts = await ProductsXUser.findAll({
      where: { userID_user: userId, units: { [Sequelize.Op.gt]: 0 } },
      attributes: ['productsID_product', 'units']
    });

    // Conversia rezultatelor într-un format utilizabil
    const userProductsMap = userProducts.reduce((acc, cur) => {
      acc[cur.productsID_product] = cur.units;
      return acc;
    }, {});

    // Obținerea tuturor meselor, inclusiv atributul 'id_mealsXproducts' în 'MealXProducts'
    const allMeals = await Meals.findAll({
      include: [{
        model: MealsXProducts,
        as: 'MealXProducts',
        attributes: ['id_mealsXproducts', 'productsID_meals', 'mealsID_meals', 'quantity_ingredient', 'required_units'], // Includem 'id_mealsXproducts'
        include: [{
          model: Products,
          as: 'Product',
          attributes: ['id_product', 'name_product'] // Specificarea atributelor necesare
        }]
      }]
    });

    // Filtrarea meselor valide pe baza produselor utilizatorului și a unităților necesare
    const validMeals = allMeals.filter(meal => {
      return meal.MealXProducts.every(mxp => {
        // Verificarea dacă utilizatorul are produsul necesar cu unități suficiente
        const requiredUnits = mxp.required_units;
        const userUnits = userProductsMap[mxp.productsID_meals];
        return userUnits && userUnits >= requiredUnits;
      });
    });

    res.json(validMeals);
  } catch (error) {
    console.error('Failed to generate meal from selected products:', error);
    res.status(500).send('Internal Server Error');
  }
});





router.get('/details/:id', authenticateJWT, async (req, res) => {
  try {
    const meal = await Meals.findOne({
      where: { id_meal: req.params.id }, 
      include: [{
        model: MealsXProducts,
        as: 'MealXProducts',
        include: [{
          model: Products,
          as: 'Product'
        }]
      }]
    });

    res.json(meal);
  } catch (error) {
    console.error('Error fetching meal details:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/mealWithBudget', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id_user;
    const user = await User.findByPk(userId);
    const budget = user.budget;

    // Query to find all meals with a price less than or equal to the user's budget
    const mealsWithinBudget = await Meals.findAll({
      where: { price_meal: { [Sequelize.Op.lte]: budget } },
      order: [['price_meal', 'DESC']],
      attributes: ['id_meal', 'name_meal', 'price_meal', 'base64CodImageMeal'],
    });

    // Return the meals if found, otherwise return a message
    if (mealsWithinBudget.length > 0) {
      res.json(mealsWithinBudget);
    } else {
      res.json({ message: "No meals found within your budget!" });
    }
  } catch (error) {
    console.error('Error fetching meals within budget:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/recommendedMeals', authenticateJWT, async (req, res) => {
  try {
    const recommendedMeals = await Meals.findAll({
      where: { our_rec_meal: true },
      attributes: ['id_meal', 'name_meal', 'base64CodImageMeal']
    });

    if (recommendedMeals && recommendedMeals.length > 0) {
      res.json(recommendedMeals);
    } else {
      res.status(404).send('No recommended meals found.');
    }
  } catch (error) {
    console.error('Error fetching recommended meals:', error);
    res.status(500).send('Internal Server Error');
  }
});


  module.exports = router;