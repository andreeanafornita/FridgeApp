const express = require('express');
const { PreviousSearches, User } = require('../models');
const passport = require('passport');
const router = express.Router();

router.use(express.json()); 

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', 
  algorithms: ['HS256'],
};

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  console.log("JWT Payload:", jwt_payload);
  User.findByPk(jwt_payload.id_user) 
      .then(user => {
          if (user) {
              return done(null, user);
          } else {
              console.log("User not found in DB");
              return done(null, false);
          }
      })
      .catch(err => {
          return done(err, false);
      });
}));

const authenticateJWT = passport.authenticate('jwt', { session: false });

  router.get('/getsearches', authenticateJWT, async (req, res) => {
    try {
      const previousSearches = await PreviousSearches.findAll({
        where: { idUser_search: req.user.id_user },
        order: [['date_timeSearch', 'DESC']],
        limit: 10, 
      });
      res.json(previousSearches);
    } catch (error) {
      console.error('Failed to load previous searches:', error);
      res.status(500).json({ error: 'Failed to load previous searches' });
    }
  });
  
  
  router.post('/searches', authenticateJWT, async (req, res) => {
    const { keyword } = req.body;
    try {
      const count = await PreviousSearches.count({ where: { idUser_search: req.user.id_user } });
      if (count >= 10) {
        const oldestSearch = await PreviousSearches.findOne({
          where: { idUser_search: req.user.id_user },
          order: [['date_timeSearch', 'ASC']],
        });
        if (oldestSearch) {
          await oldestSearch.destroy();
        }
      }
      console.log('Received keyword for search:', keyword);
      await PreviousSearches.create({ keyword_search: keyword, idUser_search: req.user.id_user });
      console.log('Search added successfully for user:', req.user.id_user);
  
      const updatedSearches = await PreviousSearches.findAll({
        where: { idUser_search: req.user.id_user },
        order: [['date_timeSearch', 'DESC']],
      });
  
      res.json(updatedSearches);
    } catch (error) {
      console.error('Failed to add search:', error);
      res.status(500).json({ error: 'Failed to add search' });
    }
  });
  
  

  
module.exports = router;