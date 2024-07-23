// routes/individualRoutes.js
const express = require('express');
const router = express.Router();
const Individual = require('../models/individual');

// Create an individual
router.post('/create', async (req, res) => {
  try {
    const { names } = req.body; // Expecting an array of names
    const individuals = names.map(name => new Individual({ name }));
    await Individual.insertMany(individuals);
    res.status(201).json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all individuals
router.get('/', async (req, res) => {
  try {
    const individuals = await Individual.find();
    res.status(200).json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update food taken for an individual
router.post('/:id/food', async (req, res) => {
  try {
    const { foodTaken, ticked } = req.body;
    const individual = await Individual.findById(req.params.id);
    if (!individual) {
      return res.status(404).json({ error: 'Individual not found' });
    }
    individual.foodTaken = foodTaken;
    individual.ticked = ticked;
    await individual.save();
    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
