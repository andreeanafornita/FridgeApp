const passport = require('passport');
const express = require('express');
const router = express.Router();
const { AllTargets } = require('../models');
const authenticateJWT = passport.authenticate('jwt', { session: false });

router.post('/create', async (req, res) => {
    try {
      const { description, isHardTarget } = req.body;
      const newTarget = await AllTargets.create({ description, isHardTarget });
      res.status(201).json(newTarget);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Delete a target by id
router.delete('/delete/:id_target', async (req, res) => {
    try {
      const { id_target } = req.params;
      const target = await AllTargets.findByPk(id_target);
      if (!target) {
        return res.status(404).json({ error: 'Target not found' });
      }
      await target.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Update a target
router.put('/edit/:id_target', async (req, res) => {
    try {
      const { id_target } = req.params;
      const { description, isHardTarget } = req.body;
      const target = await AllTargets.findByPk(id_target);
      if (!target) {
        return res.status(404).json({ error: 'Target not found' });
      }
      target.description = description;
      target.isHardTarget = isHardTarget;
      await target.save();
      res.json(target);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Fetch all targets
// Adaugă authenticateJWT ca middleware înaintea handler-ului tău de route
router.get('/get', authenticateJWT, async (req, res) => {
  try {
      const targets = await AllTargets.findAll();
      res.json(targets);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/hardTargets', authenticateJWT, async (req, res) => {
  try {
    const hardTargets = await AllTargets.findAll({
      where: {
        isHardTarget: 1
      },
      attributes: ['id_target', 'descriptionTarget'] // Returnează doar id_target și descriptionTarget
    });

    res.status(200).json(hardTargets);
  } catch (error) {
    console.error('Error fetching hard targets:', error);
    res.status(500).send('Internal server error');
  }
});
router.delete('/hardTargets/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    // Use the Sequelize destroy method to delete the target with the provided id
    const result = await AllTargets.destroy({
      where: {
        id_target: id
      }
    });

    if (result === 0) {
      // No records were deleted
      return res.status(404).send('The target with the specified ID does not exist.');
    }

    res.status(200).send('Target deleted successfully.');
  } catch (error) {
    console.error('Error deleting the target:', error);
    res.status(500).send('Internal server error');
  }
});



  module.exports = router;