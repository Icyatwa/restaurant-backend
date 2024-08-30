// companyRoutes
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Employee = require('../models/Employee');

router.post('/create', async (req, res) => {
    try {
        const { name, userId } = req.body;

        if (!name || !userId) {
            return res.status(400).json({ error: 'Company name and userId are required.' });
        }

        const newCompany = new Company({ name, userId });
        await newCompany.save();

        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Failed to create company. Please try again later.' });
    }
});

router.post('/add-employee', async (req, res) => {
    try {
        const { name, employeeId, companyId, isIndividual, userId } = req.body;
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
            company: company ? company._id : null,
            isIndividual,
            userId
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

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required.' });
        }

        const companies = await Company.find({ userId });
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:companyId/employees', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { userId } = req.query;
        const employees = await Employee.find({ company: companyId, userId });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify-employee', async (req, res) => {
    try {
        const { employeeId, userId } = req.body;
        const employee = await Employee.findOne({ employeeId, userId }).populate('company');

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/update-food', async (req, res) => {
    try {
        const { employeeId, foodTaken, userId } = req.body;
        const employee = await Employee.findOne({ employeeId, userId });

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