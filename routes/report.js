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
// router.post('/ticked-records', async (req, res) => {
//   try {
//     const individualRecordsData = req.body.tickedRecords;
//     const userId = req.body.userId; // Get userId from the request body
    
//     const recordsToSave = individualRecordsData.map(record => ({
//       ...record,
//       userId  // Add userId to each record
//     }));

//     const savedRecords = await TickedRecord.insertMany(recordsToSave);
//     res.status(201).json(savedRecords);
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving ticked records', error });
//   }
// });
router.post('/ticked-records', async (req, res) => {
  try {
    const individualRecordsData = req.body.tickedRecords;
    const userId = req.body.userId;
    
    const recordsToSave = individualRecordsData.map(record => ({
      ...record,
      userId
    }));

    const savedRecords = await TickedRecord.insertMany(recordsToSave);
    res.status(201).json(savedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error saving ticked records', error });
  }
});

router.get('/ticked-records', async (req, res) => {
  try {
    const { userId } = req.query;
    const tickedRecords = await TickedRecord.find({ userId }).populate('company');
    res.status(200).json(tickedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticked records', error });
  }
});


router.get('/ticked-individuals', async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameters
    const tickedIndividuals = await TickedIndividual.find({ userId }).populate('individualId');
    res.status(200).json(tickedIndividuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
