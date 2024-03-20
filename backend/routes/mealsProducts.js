const express = require('express');
const router = express.Router();
const { MealsProducts } = require('../models');
router.post('/create', async (req, res) => {
    try {
      const { MealsId_meals, Productsid_products, quantity_ingredients_products } = req.body;
      const newAssociation = await MealsProducts.create({
        MealsId_meals,
        Productsid_products,
        quantity_ingredients_products
      });
      res.status(201).json(newAssociation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.delete('/delete', async (req, res) => {
    try {
      const { MealsId_meals, Productsid_products } = req.body;
      const association = await MealsProducts.findOne({
        where: {
          MealsId_meals,
          Productsid_products
        }
      });
      if (!association) {
        return res.status(404).json({ error: 'Association not found' });
      }
      await association.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.put('/edit', async (req, res) => {
    try {
      const { MealsId_meals, Productsid_products, newQuantity } = req.body;
      const association = await MealsProducts.findOne({
        where: {
          MealsId_meals,
          Productsid_products
        }
      });
      if (!association) {
        return res.status(404).json({ error: 'Association not found' });
      }
      association.quantity_ingredients_products = newQuantity;
      await association.save();
      res.json(association);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;