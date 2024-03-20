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
    const userProductIds = (await ProductsXUser.findAll({
      where: { userID_user: userId, units: { [Sequelize.Op.gt]: 0 } },
      attributes: ['productsID_product']
    })).map(up => up.productsID_product);

    const allMeals = await Meals.findAll({
      include: [{
        model: MealsXProducts,
        as: 'MealXProducts',
        include: [{
          model: Products,
          as: 'Product'
        }]
      }]
    });

    const validMeals = allMeals.filter(meal => {
      const mealProductIds = meal.MealXProducts.map(mxp => mxp.productsID_meals);
      
      return mealProductIds.every(pid => userProductIds.includes(pid));
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

    const meal = await Meals.findOne({
      where: { price_meal: { [Sequelize.Op.lte]: budget }, our_rec_meal: true },
      order: [[ 'price_meal', 'DESC' ]],
      attributes: ['id_meal', 'name_meal', 'base64CodImageMeal'],
    });

    if (meal) {
      res.json([meal]);
    } else {
      res.json({ message: "We didn't find a meal with exactly your budget! Please try again" });
    }
  } catch (error) {
    console.error('Error fetching meal with budget:', error);
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