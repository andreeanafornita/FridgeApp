const express = require('express');
const {  User } = require('../models'); 
const passport = require('passport');
const router = express.Router();
const PreviousDates = require('../models/PreviousDates');

router.use(express.json()); 


const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret', 
  algorithms: ['HS256'],
};

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  console.log("JWT Payload:", jwt_payload);
  User.findByPk(jwt_payload.id_user) // Presupunem că 'id_user' este câmpul din jwt_payload
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


const authenticateJWT = passport.authenticate('jwt', { session: false });

router.get('/getDates/:userId/:productId', authenticateJWT, async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const dates = await PreviousDates.findAll({
            where: {
                idUser_date: userId,
                idProduct_date: productId
            },
            attributes: ['date_expirationProduct'],
            order: [['date_timeDate', 'DESC']]
        });

        res.status(200).json(dates);
    } catch (error) {
        console.error('Error retrieving expiration dates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/setExpirationDate', authenticateJWT, async (req, res) => {
    const { userId, productId, expirationDate } = req.body;

    try {
        const existingRecord = await PreviousDates.findOne({
            where: {
                idUser_date: userId,
                idProduct_date: productId
            }
        });

        if (existingRecord) {
            await existingRecord.update({
                date_expirationProduct: expirationDate
            });
        } else {
            await PreviousDates.create({
                idUser_date: userId,
                idProduct_date: productId,
                date_expirationProduct: expirationDate
            });
        }

        res.status(200).json({ success: true, message: 'Expiration date set successfully.' });
    } catch (error) {
        console.error('Error setting expiration date:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Definiți ruta POST pentru a salva o nouă dată de expirare
router.post('/saveExpirationDate', authenticateJWT, async (req, res) => {
    try {
        // Extrageți id-ul utilizatorului și id-ul produsului din corpul cererii
        const { userId, productId, expirationDate } = req.body;

        // Verificați dacă există deja 10 date salvate pentru utilizatorul și produsul respectiv
        const count = await PreviousDates.count({
            where: {
                idUser_date: userId,
                idProduct_date: productId,
            }
        });

        if (count >= 10) {
            // Dacă există deja 10 date, ștergeți cea mai veche înregistrare
            await PreviousDates.destroy({
                where: {
                    idUser_date: userId,
                    idProduct_date: productId,
                },
                order: [['date_timeDate', 'ASC']], // Ștergeți înregistrarea cu cea mai veche dată
                limit: 1,
            });
        }

        // Salvăm noua dată de expirare în baza de date
        await PreviousDates.create({
            idUser_date: userId,
            idProduct_date: productId,
            date_expirationProduct: expirationDate,
        });

     
        const expirationDates = await PreviousDates.findAll({
            where: {
                idUser_date: userId,
                idProduct_date: productId,
            },
            order: [['date_timeDate', 'DESC']], // Ordonăm descrescător după data și ora introdusă
        });

        // Returnăm datele de expirare către client
        res.json(expirationDates);
    } catch (error) {
        console.error('Error saving expiration date:', error);
        res.status(500).json({ error: 'Failed to save expiration date' });
    }
});
router.get('/expirations/:productId', authenticateJWT, (req, res) => {
    const userId = req.user.id_user; // Obținerea ID-ului utilizatorului din request
    const productId = req.params.productId;
  
    PreviousDates.findAll({
      where: {
        idUser_date: userId,
        idProduct_date: productId
      }
    })
    .then(dates => {
      if (dates.length > 0) {
        res.json({ success: true, expirations: dates });
      } else {
        res.status(404).json({ success: false, message: "Nu există date de expirare setate pentru acest produs." });
      }
    })
    .catch(err => {
      console.error("Eroare la interogarea bazei de date:", err);
      res.status(500).json({ success: false, message: "Eroare la interogarea bazei de date." });
    });
  });
  
  // Setarea unei noi date de expirare pentru un produs, de către un utilizator autorizat
  router.post('/set-expiration', authenticateJWT, (req, res) => {
    const userId = req.user.id_user; // Obținerea ID-ului utilizatorului din request
    const { idProduct_date, date_expirationProduct } = req.body; // Obținerea datelor din corpul cererii
  
    PreviousDates.create({
      idUser_date: userId,
      idProduct_date,
      date_expirationProduct
    })
    .then(date => {
      res.json({ success: true, message: "Data de expirare a fost setată cu succes.", date });
    })
    .catch(err => {
      console.error("Eroare la salvarea în baza de date:", err);
      res.status(500).json({ success: false, message: "Eroare la salvarea datei de expirare." });
    });
  });

module.exports = router;