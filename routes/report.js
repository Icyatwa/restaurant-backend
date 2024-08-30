// report.js 
const express = require('express');
const router = express.Router();
const TickedRecord = require('../models/TickedRecord');
const Employee = require('../models/Employee');
const TickedIndividual = require('../models/TickedIndividual');

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
