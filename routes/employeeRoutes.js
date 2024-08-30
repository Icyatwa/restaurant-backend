// employeeRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.put('/:employeeId/update-food', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { foodTaken } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.foodTaken = foodTaken;
    await employee.save();

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/ticked-company-employees', async (req, res) => {
  try {
    const tickedCompanyEmployees = await Employee.find({ company: { $ne: null }, ticked: true }).populate('company');

    const result = tickedCompanyEmployees.map(employee => ({
      _id: employee._id,
      name: employee.name,
      employeeId: employee.employeeId,
      companyName: employee.company.name,
      foodTaken: employee.foodTaken
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;