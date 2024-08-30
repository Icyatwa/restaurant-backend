// individualRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const TickedIndividual = require('../models/TickedIndividual');

router.post('/add', async (req, res) => {
  try {
    const { name, employeeId, userId } = req.body;
    const newIndividual = new Employee({ name, employeeId, userId, isIndividual: true });
    await newIndividual.save();
    res.status(201).json(newIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const individuals = await Employee.find({ isIndividual: true, userId });
    res.status(200).json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const individual = await Employee.findOne({ _id: req.params.id, userId, isIndividual: true });
    if (!individual) {
      return res.status(404).json({ error: 'Individual not found' });
    }
    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-food', async (req, res) => {
  try {
    const { individualId, foodTaken, userId } = req.body;
    const individual = await Employee.findOne({ _id: individualId, userId });
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
    const { foodTaken, ticked, userId } = req.body;
    const individual = await Employee.findOne({ _id: req.params.id, userId, isIndividual: true });
    if (!individual) {
      return res.status(404).json({ error: 'Individual not found' });
    }

    individual.foodTaken = foodTaken;
    individual.ticked = ticked;
    await individual.save();

    if (ticked) {
      const existingTicked = await TickedIndividual.findOne({ individualId: req.params.id });
      if (existingTicked) {
        existingTicked.foodTaken = foodTaken;
        existingTicked.updatedAt = Date.now();
        await existingTicked.save();
      } else {
        const newTicked = new TickedIndividual({
          name: individual.name,
          individualId: individual._id,
          foodTaken: foodTaken,
          ticked: true,
          userId: individual.userId
        });
        await newTicked.save();
      }
    }

    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
