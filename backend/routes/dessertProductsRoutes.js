const express = require('express');
const router = express.Router();
const { DessertsProducts } = require('../models');
router.post('/create', async (req, res) => {
    try {
      const { Productsid_product, Dessertsid_dessert, quantity_ingredients } = req.body;
      const newAssociation = await DessertsProducts.create({
        Productsid_product,
        Dessertsid_dessert,
        quantity_ingredients
      });
      res.status(201).json(newAssociation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // În cazul acestui model, trebuie să specifici ambele chei străine pentru a identifica corect asociația
router.delete('/delete', async (req, res) => {
    try {
      const { Productsid_product, Dessertsid_dessert } = req.body;
      const association = await DessertsProducts.findOne({
        where: {
          Productsid_product,
          Dessertsid_dessert
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
      const { Productsid_product, Dessertsid_dessert, newQuantity } = req.body;
      const association = await DessertsProducts.findOne({
        where: {
          Productsid_product,
          Dessertsid_dessert
        }
      });
      if (!association) {
        return res.status(404).json({ error: 'Association not found' });
      }
      association.quantity_ingredients = newQuantity;
      await association.save();
      res.json(association);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;