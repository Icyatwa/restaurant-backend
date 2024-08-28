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
const TickedRecord = require('../models/TickedRecord');
const Employee = require('../models/Employee');
const TickedIndividual = require('../models/TickedIndividual');

// Route to get ticked records
router.get('/ticked-records', async (req, res) => {
  try {
    const tickedRecords = await TickedRecord.find().populate('company');
    res.json(tickedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticked records', error });
  }
});

// Route to save ticked records
router.post('/ticked-records', async (req, res) => {
  try {
    const individualRecordsData = req.body.tickedRecords;
    const savedRecords = await TickedRecord.insertMany(individualRecordsData);
    res.status(201).json(savedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error saving ticked records', error });
  }
});


router.get('/ticked-individuals', async (req, res) => {
  try {
    const tickedIndividuals = await TickedIndividual.find().populate('individualId');
    res.status(200).json(tickedIndividuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
