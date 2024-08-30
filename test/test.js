
// TickedIndividual.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tickedIndividualSchema = new Schema({
  name: { type: String, required: true },
  individualId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  foodTaken: { type: String, default: '' },
  ticked: { type: Boolean, default: true },
  userId: { type: String, required: true }, // Add userId to schema
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TickedIndividual', tickedIndividualSchema);

// individualRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const TickedIndividual = require('../models/TickedIndividual');

// Route to add an individual
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

// Route to get all individuals for a specific user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameters
    const individuals = await Employee.find({ isIndividual: true, userId });
    res.status(200).json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get an individual by ID for a specific user
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameters
    const individual = await Employee.findOne({ _id: req.params.id, userId, isIndividual: true });
    if (!individual) {
      return res.status(404).json({ error: 'Individual not found' });
    }
    res.status(200).json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update food taken by an individual for a specific user
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

// Route to update food taken and tick an individual for a specific user
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
          userId: individual.userId // Ensure userId is saved in the ticked record as well
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

// // report.js
// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/Employee');

// Route to generate a report for ticked employees and individuals
// router.get('/ticked-all', async (req, res) => {
//   try {
//     // Find all employees who have taken their meals (ticked)
//     const tickedEmployees = await Employee.find({ foodTaken: { $ne: '' } });

//     // Separate company employees from individuals
//     const companyEmployees = tickedEmployees.filter(emp => !emp.isIndividual);
//     const individuals = tickedEmployees.filter(emp => emp.isIndividual);

//     res.json({
//       companyEmployees,
//       individuals
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating report', error });
//   }
// });



// module.exports = router;

// report.js 
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const TickedIndividual = require('../models/TickedIndividual');

router.post('/ticked-individuals', async (req, res) => {
  try {
    const individualRecordsData = req.body.tickedRecords;
    const userId = req.body.userId;
    
    const recordsToSave = individualRecordsData.map(record => ({
      ...record,
      userId
    }));

    const savedRecords = await TickedIndividual.insertMany(recordsToSave);
    res.status(201).json(savedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error saving ticked records', error });
  }
});

router.get('/ticked-individuals', async (req, res) => {
  try {
    const { userId } = req.query;
    const tickedRecords = await TickedIndividual.find({ userId }).populate('individualId');
    res.status(200).json(tickedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticked records', error });
  }
});

module.exports = router;
