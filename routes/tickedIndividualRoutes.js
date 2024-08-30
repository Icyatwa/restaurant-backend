// tickedIndividualRoutes.js
const express = require('express');
const router = express.Router();
const TickedIndividual = require('../models/TickedIndividual');

router.post('/add', async (req, res) => {
  try {
    const { name, individualId, foodTaken, userId } = req.body;
    const newTickedIndividual = new TickedIndividual({
      name,
      individualId,
      foodTaken,
      userId,
    });
    await newTickedIndividual.save();
    res.status(201).json(newTickedIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const tickedIndividuals = await TickedIndividual.find({ userId });
    res.status(200).json(tickedIndividuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const tickedIndividual = await TickedIndividual.findOne({ _id: req.params.id, userId });
    if (!tickedIndividual) {
      return res.status(404).json({ error: 'Ticked individual not found' });
    }
    res.status(200).json(tickedIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { foodTaken, ticked, userId } = req.body;
    const tickedIndividual = await TickedIndividual.findOne({ _id: req.params.id, userId });
    if (!tickedIndividual) {
      return res.status(404).json({ error: 'Ticked individual not found' });
    }

    tickedIndividual.foodTaken = foodTaken || tickedIndividual.foodTaken;
    tickedIndividual.ticked = ticked !== undefined ? ticked : tickedIndividual.ticked;
    tickedIndividual.updatedAt = Date.now();

    await tickedIndividual.save();
    res.status(200).json(tickedIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const tickedIndividual = await TickedIndividual.findOneAndDelete({ _id: req.params.id, userId });
    if (!tickedIndividual) {
      return res.status(404).json({ error: 'Ticked individual not found' });
    }
    res.status(200).json({ message: 'Ticked individual deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
