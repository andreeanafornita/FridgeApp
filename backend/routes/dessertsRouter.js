const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Desserts, ProductsXUser, DessertsXProducts, User, Products } = require('../models');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Sequelize } = require('sequelize');
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', 
  algorithms: ['HS256'],
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  User.findByPk(jwt_payload.id_user)
    .then(user => {
      if (user) {
        console.log("User found in DB:", user);
        done(null, user);
      } else {
        console.log("User not found in DB");
        done(null, false);
      }
    })
    .catch(err => {
      console.error("Error in JWT strategy:", err);
      done(err, false);
    });
}));
const authenticateJWT = passport.authenticate('jwt', { session: false });
router.get('/generateDessertFromProducts', authenticateJWT, async (req, res) => {
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

    // Obținerea tuturor deserturilor, inclusiv atributul 'id_dessertsXproducts' în 'DessertsXProducts'
    const allDesserts = await Desserts.findAll({
      include: [{
        model: DessertsXProducts,
        as: 'DessertsProducts',
        attributes: ['id_dessertsXproducts', 'productsID_desserts', 'dessertsID_dessert', 'quantity_product', 'units_required_dessert'], // Includem 'id_dessertsXproducts'
        include: [{
          model: Products,
          as: 'Products',
          attributes: ['id_product', 'name_product'] // Specificarea atributelor necesare
        }]
      }]
    });

    // Filtrarea deserturilor valide pe baza produselor utilizatorului și a unităților necesare
    const validDesserts = allDesserts.filter(dessert => {
      return dessert.DessertsProducts.every(dxp => {
        // Verificarea dacă utilizatorul are produsul necesar cu unități suficiente
        const requiredUnits = dxp.units_required_dessert;
        const userUnits = userProductsMap[dxp.productsID_desserts];
        return userUnits && userUnits >= requiredUnits;
      });
    });

    res.json(validDesserts);
  } catch (error) {
    console.error('Failed to generate dessert from selected products:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/details/:id', authenticateJWT, async (req, res) => {
  try {
    const dessert = await Desserts.findOne({
      where: { id_dessert: req.params.id }, 
      include: [{
        model: DessertsXProducts,
        as: 'DessertsProducts',
        include: [{
          model: Products,
          as: 'Products'
        }]
      }]
    });

    res.json(dessert);
  } catch (error) {
    console.error('Error fetching dessert details:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/dessertWithBudget', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id_user;
    const user = await User.findByPk(userId);
    const budget = user.budget;

    const dessert = await Desserts.findOne({
      where: { price_dessert: { [Sequelize.Op.lte]: budget }, our_rec_dessert: true },
      order: [[ 'price_dessert', 'DESC' ]],
      attributes: ['id_dessert', 'name_dessert', 'base64CodeImageDessert'],
    });

    if (dessert) {
      res.json([dessert]);
    } else {
      res.json({ message: "We didn't find a dessert with exactly your budget! Please try again." });
    }
  } catch (error) {
    console.error('Error fetching dessert with budget:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/recommendedDesserts', authenticateJWT, async (req, res) => {
  try {
    const recommendedDesserts = await Desserts.findAll({
      where: { our_rec_dessert: true },
      attributes: ['id_dessert', 'name_dessert', 'base64CodeImageDessert']
    });

    if (recommendedDesserts && recommendedDesserts.length > 0) {
      res.json(recommendedDesserts);
    } else {
      res.status(404).send('No recommended desserts found.');
    }
  } catch (error) {
    console.error('Error fetching recommended desserts:', error);
    res.status(500).send('Internal Server Error');
  }
});


  
module.exports = router;