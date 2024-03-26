const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authenticateJWT = passport.authenticate('jwt', { session: false });
const jwtSecret = 'your_jwt_secret';
//const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', // Înlocuiește 'your_jwt_secret' cu cheia ta secretă
  algorithms: ['HS256'],
};
// Create a new user
// {
//     "id": 1,
//     "username": "andrea123",
//     "password": "$2a$10$lF9Jeny.YC2RqX2FkRuvYuRcePjMy5asZ6oIlSlEsD1PvFMfSkMDG"
//   }
//http://localhost:8081/users/
const generateToken = (user) => {
  const payload = {
    id_user: user.id_user, // Ensure you have a unique identifier for the user
  };
  const secret = 'your_jwt_secret'; // Replace with your real secret key
  const options = { expiresIn: '1h' }; // Token expires in 1 hour

  return jwt.sign(payload, secret, options);
};
passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  User.findByPk(jwt_payload.id_user).then(user => {
    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'User not found with this token.' });
  }).catch(err => done(err, false));
}));

// În fișierul de rute al utilizatorului, adaugă un nou endpoint de tip PUT
router.put('/userBudget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { budget } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    user.budget = budget;
    await user.save();

    res.status(200).json({ message: "Budget updated successfully", budget: user.budget });
  } catch (error) {
    console.error('Error updating user budget:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/', async (req, res) => {
  const { username, password } = req.body; // Include username in the destructured assignment
  console.log("Attempting to register a new user with username:", req.body.username);
  if (!username || !password) {
    return res.status(400).json('Bad Request');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password:hashedPassword }); // Include username when creating a user
    const token = generateToken(newUser);
    res.json({
      message: "User registered successfully",
      user: { id: newUser.id_user, username: newUser.username },
      token: token, // Asigură-te că acesta este trimis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  // Get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  router.post('/login', async (req, res) => {
    const { username, password } = req.body; // obține username-ul și parola din request

    try {
        // Caută utilizatorul în baza de date după username
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Verifică parola
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Aici poți adăuga logica pentru generarea unui token JWT sau alt mecanism de sesiune
        const token = jwt.sign(
          { id_user: user.id_user }, // Payload-ul tokenului
          jwtSecret, // Secretul pentru semnare
          { expiresIn: '100h' } // Opțiuni, de exemplu, expirarea tokenului
      );

        // Parola se potrivește, returnează succes
        res.status(200).json({ message: "Login successful",token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/user/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['username', 'budget'] // Include only the username and budget in the response
    });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.status(200).json({
      username: user.username,
      budget: user.budget
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Internal server error');
  }
});
router.put('/updateBudget', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.user.id_user; // Presupunem că ID-ul utilizatorului este disponibil prin middleware-ul de autentificare JWT
  const { budget } = req.body; // Valoarea nouă a bugetului trimisă în corpul cererii

  try {
    // Găsește utilizatorul în baza de date folosind ID-ul extras din tokenul JWT
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Actualizează bugetul utilizatorului
    user.budget = budget;
    await user.save();

    // Trimite un răspuns de succes împreună cu bugetul actualizat
    res.status(200).json({ message: 'Budget updated successfully', budget: user.budget });
  } catch (error) {
    console.error('Error updating the budget:', error);
    res.status(500).send('Internal server error');
  }
});
// Server - într-un fișier de rute, ex: userRoutes.js
router.get('/current', authenticateJWT, async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id_user);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ userID: user.id_user, username: user.username });
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});
// Schimbarea parolei
router.put('/updatePassword', authenticateJWT, async (req, res) => {
  const userId = req.user.id_user;
  const { currentPassword, newPassword } = req.body;

  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
          return res.status(401).send('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating the password:', error);
      res.status(500).send('Internal server error');
  }
});
// Schimbarea username-ului
router.put('/updateUsername', authenticateJWT, async (req, res) => {
  const userId = req.user.id_user;
  const { newUsername } = req.body;

  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      user.username = newUsername;
      await user.save();

      res.status(200).json({ message: 'Username updated successfully', username: user.username });
  } catch (error) {
      console.error('Error updating the username:', error);
      res.status(500).send('Internal server error');
  }
});


module.exports = router;