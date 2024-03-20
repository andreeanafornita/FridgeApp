const express = require('express');
const router = express.Router();
const { Products } = require('../models');
const passport = require('passport');
const authenticateJWT = passport.authenticate('jwt', { session: false });
const jwtSecret = 'your_jwt_secret';
const {  ProductsXUser } = require('../models');

const app = express();

app.use(express.json()); // This line is crucial

// Endpoint pentru adăugarea unui target în "Your Targets"
const expressJwt = require('express-jwt');const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', // Înlocuiește cu cheia ta secretă reală
  algorithms: ['HS256'],
};
// In your passport JWT strategy setup
passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  console.log("JWT Payload:", jwt_payload);
  User.findByPk(jwt_payload.id_user) // Assuming 'id_user' is the field in jwt_payload
      .then(user => {
          if (user) {
              console.log("User found in DB in passport strategy:", user);
              return done(null, user);
          } else {
              console.log("User not found in DB");
              return done(null, false);
          }
      })
      .catch(err => {
          console.log("Error in JWT strategy:", err);
          return done(err, false);
      });
}));

router.post('/create', async (req, res) => {
    try {
      const { name_product, base64codImgProduct, quantity_product, calories_product, proteins_product, glucides_product, price_product } = req.body;
      const newProduct = await Products.create({
        name_product,
        base64codImgProduct,
        quantity_product,
        calories_product,
        proteins_product,
        glucides_product,
        price_product
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.delete('/delete/:id_product', async (req, res) => {
    try {
      const { id_product } = req.params;
      const product = await Products.findByPk(id_product);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // This route will be used to get product names for the search bar suggestions.
router.get('/productNames', authenticateJWT, async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ['name_product'], // Only retrieve the names
    });
    const productNames = products.map(product => product.name_product);
    res.json(productNames);
  } catch (error) {
    console.error('Error fetching product names:', error);
    res.status(500).send('Internal server error');
  }
});

  router.get('/productsShow',authenticateJWT, async (req, res) => {
    //console.log('Token received:', req.headers.authorization);
    try {
        const products = await Products.findAll();
        console.log('Products found:', products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal server error');
    }
});
  router.put('/edit/:id_product', async (req, res) => {
    try {
      const { id_product } = req.params;
      const { name_product, base64codImgProduct, quantity_product, calories_product, proteins_product, glucides_product, price_product } = req.body;
      const product = await Products.findByPk(id_product);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      product.name_product = name_product;
      product.base64codImgProduct = base64codImgProduct;
      product.quantity_product = quantity_product;
      product.calories_product = calories_product;
      product.proteins_product = proteins_product;
      product.glucides_product = glucides_product;
      product.price_product = price_product;
      
      await product.save();
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.post('/add-product', authenticateJWT, async (req, res) => {
    console.log('add-product route hit');
    console.log('Request body:', req.body);
    const productsID_product = req.body.productsID_product;
    const userID_user = req.user.id_user; // Utilizăm id-ul utilizatorului din token
    console.log('Authenticated user ID:', userID_user);
    console.log('Attempting to add or update product for user:', { userID_user, productsID_product });
    if (!userID_user || !productsID_product) {
      return res.status(400).json({ error: 'Missing userID_user or productID_product' });
    }
  
    try {
      let newUnits;
      // Căutăm dacă produsul este deja adăugat pentru utilizator
      const existingEntry = await ProductsXUser.findOne({
        where: { userID_user: userID_user, productsID_product: productsID_product }
      });
  
      if (existingEntry) {
        // Actualizăm intrarea existentă cu noile unități
        console.log('Found existing entry, updating units');
        existingEntry.units += 1; // Creștem numărul de unități cu 1
        await existingEntry.save();
        newUnits = existingEntry.units;
      } else {
        // Cream o nouă intrare cu unitățile
        console.log('Creating new entry');
        const newEntry = await ProductsXUser.create({ userID_user, productsID_product, units: 1 }); // Inițializăm cu 1 unitate
        newUnits = newEntry.units;
      }
      console.log('Sending response back with new units:', newUnits);
      res.status(201).json({ units: newUnits }); // Returnăm numărul actualizat de unități
    } catch (error) {
      console.error('Error adding product to user:', error);
      res.status(500).send('Internal server error');
    }
  });
  
router.get('/get-product-units/:id', authenticateJWT, async (req, res) => {
  const userID_user = req.user.id_user;
  const { id } = req.params;

  try {
    const entry = await ProductsXUser.findOne({
      where: {
        userID_user: userID_user,
        productsID_product:id
}
});


if (entry) {
  res.json({ units: entry.units });
} else {
  // If there is no entry for this product for the user, return 0 units
  res.json({ units: 0 });
}
} catch (error) {
console.error('Error fetching product units:', error);
res.status(500).send('Internal server error');
}
});
router.post('/remove-product', authenticateJWT, async (req, res) => {
  console.log('remove-product route hit');
  console.log('Request body:', req.body);
  const productsID_product = req.body.productsID_product;
  const userID_user = req.user.id_user; // Utilizăm id-ul utilizatorului din token
  console.log('Authenticated user ID:', userID_user);
  console.log('Attempting to remove product for user:', { userID_user, productsID_product });
  if (!userID_user || !productsID_product) {
    return res.status(400).json({ error: 'Missing userID_user or productID_product' });
  }

  try {
    let newUnits;
    // Căutăm dacă produsul este deja adăugat pentru utilizator
    const existingEntry = await ProductsXUser.findOne({
      where: { userID_user: userID_user, productsID_product: productsID_product }
    });

    if (existingEntry && existingEntry.units > 0) {
      // Actualizăm intrarea existentă cu noile unități
      console.log('Found existing entry, updating units');
      existingEntry.units -= 1; // Scădem numărul de unități cu 1
      await existingEntry.save();
      newUnits = existingEntry.units;
    } else {
      // Nu există unități de scăzut
      newUnits = 0;
    }
    console.log('Sending response back with new units:', newUnits);
    res.status(201).json({ units: newUnits }); // Returnăm numărul actualizat de unități
  } catch (error) {
    console.error('Error removing product from user:', error);
    res.status(500).send('Internal server error');
  }
});
router.get('/product/:id', authenticateJWT, async (req, res) => {
  console.log("Request received with JWT:", req.headers.authorization); 
  const { id } = req.params; // Extrage ID-ul produsului din parametrii rutei

  try {
      const product = await Products.findByPk(id);
      
      if (product) {
          res.json(product); // Întoarce toate detaliile produsului, inclusiv expiration_date
      } else {
          res.status(404).send('Product not found'); // Întoarce o eroare dacă produsul nu există
      }
  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/setExpirationDate', authenticateJWT, async (req, res) => {
  const { productId, expirationDate } = req.body;
  const userId = req.user.id_user;
  console.log(`Setting expiration date for product ${productId} and user ${userId}`);
  
  try {
    // Verificăm dacă există o înregistrare existentă
    const existingRecord = await ProductsXUser.findOne({
        where: {
          userID_user: userId,
          productsID_product: productId
        }
    });

    if (existingRecord) {
        // Dacă există, actualizăm data de expirare
        await existingRecord.update({
            exp_dateUser: expirationDate
        });
    } else {
        // Dacă nu există, creăm o nouă înregistrare
        await ProductsXUser.create({
            userID_user: userId,
            productsID_product: productId,
            exp_dateUser: expirationDate
        });
    }

    // Verificăm numărul total de înregistrări de date de expirare pentru acest produs și utilizator
    const expirationDates = await ProductsXUser.findAll({
      where: {
        userID_user: userId,
        productsID_product: productId
      },
      order: [['exp_dateUser', 'ASC']], // Le sortăm crescător după data de expirare
    });

    // Dacă avem mai mult de 10 înregistrări, ștergem cele mai vechi pentru a menține limita de 10
    while (expirationDates.length > 10) {
      await expirationDates[0].destroy();
      expirationDates.shift(); // Eliminăm prima înregistrare din array pentru a reflecta starea actuală
    }

    res.json({ success: true, message: "Expiration date set successfully." });
  } catch (error) {
    console.error('Error setting expiration date:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/getExpirationDates/:productId', authenticateJWT, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id_user;
  console.log(`Retrieving expiration dates for product ${productId} and user ${userId}`);

  try {
    const expirationDates = await ProductsXUser.findAll({
      where: {
        userID_user: userId,
        productsID_product: productId
      },
      attributes: ['exp_dateUser'], // Selectați doar coloana cu datele de expirare
      order: [['exp_dateUser', 'DESC']] // Opțional: sortați descrescător după dată
    });
    console.log('Expiration dates:', expirationDates);
    // Extrageți doar datele de expirare din fiecare înregistrare și returnați-le
    const dates = expirationDates.map(record => record.exp_dateUser);
    res.json(dates);
  } catch (error) {
    console.error('Error retrieving expiration dates:', error);
    res.status(500).send('Internal Server Error');
  }
});


  module.exports = router;