// individualRoutes.js

const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to add an individual
router.post('/add', async (req, res) => {
  try {
    const { name, employeeId } = req.body;
    const newIndividual = new Employee({ name, employeeId, isIndividual: true });
    await newIndividual.save();
    res.status(201).json(newIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all individuals
router.get('/', async (req, res) => {
  try {
    const individuals = await Employee.find({ isIndividual: true });
    res.status(200).json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get an individual by ID
router.get('/:id', async (req, res) => {
  try {
    const individual = await Employee.findById(req.params.id);
    if (!individual || !individual.isIndividual) {
      return res.status(404).json({ error: 'Individual not found' });
    }
    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update food taken by an individual
router.post('/update-food', async (req, res) => {
  try {
    const { individualId, foodTaken } = req.body;
    const individual = await Employee.findById(individualId);
    if (!individual) {
      return res.status(404).json({ error: 'Individual not found' });
    }
    individual.foodTaken = foodTaken;
    await individual.save();
    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/food', async (req, res) => {
  try {
    const { foodTaken, ticked } = req.body;
    const individual = await Employee.findById(req.params.id);
    if (!individual || !individual.isIndividual) {
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
