const express = require('express');
const router = express.Router();
const passport = require('passport');
const { YourTargets,AllTargets, User } = require('../models'); // Adjust the path as needed
const { Products } = require('../models');
// Endpoint pentru adăugarea unui target în "Your Targets"
const { expressjwt: jwt } = require('express-jwt');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', // Înlocuiește cu cheia ta secretă reală
  algorithms: ['HS256'],
};
const authenticateJWT = passport.authenticate('jwt', { session: false });
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


router.get('/getYourTargets/:userId', async (req, res) => {
  const { userId } = req.params.id_user; // ID-ul utilizatorului pentru care se preiau target-urile
  console.log("Fetching targets for userID:", req.params.userId);
  try {
    // Presupunem că ai un model User și că fiecare User are asociate YourTargets
    const userWithTargets = await User.findByPk(userId, {
      include: [{
        model: YourTargets,
        as: 'YourTargets', // Asigură-te că aceasta este denumirea corectă a asocierii din modelul User
        include: [{
          model: AllTargets,
          as: 'AllTarget' // Asigură-te că aceasta este denumirea corectă a asocierii din modelul YourTargets
        }]
      }]
    });

    if (!userWithTargets) {
      return res.status(404).send('User not found');
    }

    // Extrage și trimite doar partea de YourTargets și informațiile asociate din AllTargets
    const yourTargets = userWithTargets.YourTargets.map(target => ({
      ...target.get({ plain: true }),
      AllTargets: target.AllTargets.get({ plain: true })
    }));

    res.status(200).json(yourTargets);
    console.log("Fetched yourTargets:", yourTargets); 
  } catch (error) {
    console.error('Error fetching your targets:', error);
    res.status(500).send('Internal server error');
  }
  
});
router.get('/getYourTargets', passport.authenticate('jwt', { session: false }), async (req, res) => {
  //const userID = req.user.id_user; // Extrage ID-ul utilizatorului din tokenul JWT
  console.log("Fetching targets for authenticated userID:", req.user.id_user);
  try {
    const userWithTargets = await User.findByPk(req.user.id_user, {
      include: [{
        model: YourTargets,
        as: 'YourTargets',
        include: [{
          model: AllTargets,
          as: 'AllTarget'
        }]
      }]
    });

    if (!userWithTargets) {
      return res.status(404).send('User not found or user has no targets');
    }

    const yourTargets = userWithTargets.YourTargets.map(target => ({
      ...target.get({ plain: true }),
      AllTarget: target.AllTarget.get({ plain: true }),
      descriptionTarget: target.AllTarget.descriptionTarget // Adaugă descrierea target-ului în obiectul returnat
    }));

    res.status(200).json(yourTargets);
    console.log("Fetched yourTargets:", yourTargets);
  } catch (error) {
    console.error('Error fetching your targets:', error);
    res.status(500).send('Internal server error');
  }
});


router.post('/addYourTarget',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id_target } = req.body; // ID-ul targetului selectat pentru a fi adăugat
  const userID = req.user.id_user; // Presupunem că ID-ul utilizatorului este disponibil prin middleware-ul de autentificare
  console.log('Received request to add target:', req.body);
    console.log('Authorization Header:', req.headers.authorization);
  console.log(`Adding new target for userID: ${req.user.id_user}, targetID: ${req.body.id_target}`);
  try {
    // Verifică dacă targetul există în "All Targets"
    const targetExists = await AllTargets.findByPk(id_target);
    if (!targetExists) {
      return res.status(404).send('Target not found');
    }

    // Verifică dacă utilizatorul există
    const userExists = await User.findByPk(userID);
    if (!userExists) {
      return res.status(404).send('User not found');
    }

    // Adaugă targetul în "Your Targets", asociindu-l cu utilizatorul curent
    const yourTarget = await YourTargets.create({
      
      allTargetsID_your: id_target,
      userIDTargets: userID
      // Alte câmpuri pot fi adăugate aici dacă este necesar
    });

    res.status(201).send(yourTarget);
  } catch (error) {
    console.error('Error adding target to Your Targets:', error);
    res.status(500).send('Internal server error');
  }
});

router.delete('/delete/:id_target', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const allTargetsID_your = req.params.id_target; // ID-ul targetului de șters
  const userID = req.user.id_user; // ID-ul utilizatorului curent

  try {
    // Verifică dacă targetul există și aparține utilizatorului curent
    const targetExists = await YourTargets.findOne({
      where: {
        allTargetsID_your: allTargetsID_your, // Utilizează coloana corectă aici
        userIDTargets: userID
      }
    });

    if (!targetExists) {
      return res.status(404).send('Target not found or does not belong to the user');
    }

    // Șterge target-ul
    await targetExists.destroy();
    res.status(204).send(); // Trimite un răspuns de succes
  } catch (error) {
    console.error('Error deleting the target:', error);
    res.status(500).send('Internal server error');
  }
});


  router.put('/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { AllTargetsid_target, UserId } = req.body;
      const yourTarget = await YourTargets.findByPk(id);
      if (!yourTarget) {
        return res.status(404).json({ error: 'YourTarget not found' });
      }
  
      yourTarget.AllTargetsid_target = AllTargetsid_target;
      yourTarget.UserId = UserId;
  
      await yourTarget.save();
      res.json(yourTarget);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.get('/showDetailsProducts', authenticateJWT, async (req, res) => {
    try {
        const products = await Products.findAll({
            attributes: {
                exclude: ['expiration_date']
            }
        });
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});
  module.exports = router;
  