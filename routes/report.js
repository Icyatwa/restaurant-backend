// routes/report.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to generate a report for ticked employees and individuals
router.get('/ticked-all', async (req, res) => {
  try {
    // Find all employees who have taken their meals (ticked)
    const tickedEmployees = await Employee.find({ foodTaken: { $ne: '' } });

    // Separate company employees from individuals
    const companyEmployees = tickedEmployees.filter(emp => !emp.isIndividual);
    const individuals = tickedEmployees.filter(emp => emp.isIndividual);

    res.json({
      companyEmployees,
      individuals
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
});

module.exports = router;
