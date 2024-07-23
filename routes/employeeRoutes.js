const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Update food taken by an employee
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

module.exports = router;