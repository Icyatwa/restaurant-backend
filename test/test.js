// Company.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Add this line
});

module.exports = mongoose.model('Company', companySchema);

// companyRoutes
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Employee = require('../models/Employee');

router.post('/create', async (req, res) => {
    try {
        const { name, userId } = req.body;

        // Ensure userId and name are provided
        if (!name || !userId) {
            return res.status(400).json({ error: 'Company name and userId are required.' });
        }

        // Create the new company
        const newCompany = new Company({ name, userId });
        await newCompany.save();

        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error); // Log the full error
        res.status(500).json({ error: 'Failed to create company. Please try again later.' });
    }
});

router.post('/add-employee', async (req, res) => {
    try {
        const { name, employeeId, companyId, isIndividual, userId } = req.body; // Ensure userId is passed in the request
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
            userId // Add userId here
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
        const { userId } = req.query; // Assume userId is passed as a query parameter
        const companies = await Company.find({ userId });
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:companyId/employees', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { userId } = req.query; // Assume userId is passed as a query parameter
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

// CompanyForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useClerk } from "@clerk/clerk-react";
import '../assets/style/companyForm.css';

const CompanyForm = () => {
  const { user } = useClerk();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userId = user.id;
      const response = await axios.post('http://localhost:5000/api/companies/create', { name, userId });
      console.log('Company created:', response.data);
      setName('');
      window.location.reload(); // Auto-refresh page after submission
    } catch (error) {
      setError('Failed to create company. Please try again.');
      console.error('Error creating company:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="form-error">{error}</div>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Company Name"
          required
        />
        <button type="submit">Create Company</button>
      </form>
    </div>
  );
};

export default CompanyForm;

Server is running on port 5000
Received data: CoCa user_2lLlYZkdZwVSQ9XyJayiSWMylw0
Error creating company: Company validation failed: userId: Cast to ObjectId failed for value "user_2lLlYZkdZwVSQ9XyJayiSWMylw0" (type string) at path "userId" because of "BSONError"