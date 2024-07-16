
// companyRoutes
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Employee = require('../models/Employee');

// Create a company
router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        const newCompany = new Company({ name });
        await newCompany.save();
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add an employee to a company
router.post('/add-employee', async (req, res) => {
    try {
        const { name, employeeId, companyName, companyId, isIndividual } = req.body;
        let company = null;

        if (companyId) {
            company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }
        }

        const newEmployee = new Employee({
            name,
            employeeId,
            companyName,
            company: company ? company._id : null,
            isIndividual
        });

        await newEmployee.save();

        if (company) {
            company.employees.push(newEmployee._id);
            await company.save();
        }

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
  // Verify an employee
router.post('/verify-employee', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const employee = await Employee.findOne({ employeeId }).populate('company');

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:companyId/employees', async (req, res) => {
    try {
        const { companyId } = req.params;
        const employees = await Employee.find({ company: companyId });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/update-food', async (req, res) => {
    try {
        const { employeeId, foodTaken } = req.body;
        const employee = await Employee.findOne({ employeeId });

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
