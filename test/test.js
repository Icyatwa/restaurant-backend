
// Company.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('Company', companySchema);

// Employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  isIndividual: { type: Boolean, default: false },
  foodTaken: { type: String, default: '' }
});

module.exports = mongoose.model('Employee', employeeSchema);


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
        const { name, employeeId, companyId, isIndividual } = req.body;
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

// employeeRoutes.js
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


// Individual.js


// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const http = require('http');
const socketIo = require('socket.io');
const companyRoutes = require('./routes/companyRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/companies', companyRoutes);

const server = http.createServer(app);
const io = socketIo(server);

module.exports.io = io;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });



// CompanyList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/companyList.css';
import AddButton from '../components/addButton';
import pic1 from '../assets/img/Chef-pana.png';
import pic2 from '../assets/img/Cooking-bro.png';
import pic3 from '../assets/img/Coffee shop-bro.png';
import pic4 from '../assets/img/fast food-pana.png';
import pic5 from '../assets/img/fruit salad-rafiki.png';
import pic6 from '../assets/img/Lunch time-bro.png';
import pic7 from '../assets/img/Street Food-pana.png';
import { useNavigate } from 'react-router-dom';

const CompanyList = ({ onSelectCompany, onAddNewCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(true);
  const [person, setPerson] = useState(false);
  const navigate = useNavigate();

  const handleCompaniesClick = () => {
    setCompany(true);
    setPerson(false);
  };

  const handlePersonClick = () => {
    setCompany(false);
    setPerson(true);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error.message);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelectCompany = (companyId) => {
    if (onSelectCompany) {
      onSelectCompany(companyId);
    } else {
      navigate(`/company/${companyId}/employees`);
    }
  };

  return (
    <div className='list-container'>
      <div className='bookingBackgroud'>
        <img src={pic1} alt='' />
        <img src={pic2} alt='' />
        <img src={pic3} alt='' />
        <img src={pic4} alt='' />
        <img src={pic5} alt='' />
        <img src={pic6} alt='' />
        <img src={pic7} alt='' />
      </div>
      <div className='ctn'>
        <div className='buttons'>
          <button
            className={`btn ${company ? "active" : ""}`}
            onClick={handleCompaniesClick}
          >
            Companies
          </button>
          <button
            className={`btn ${person ? "active" : ""}`}
            onClick={handlePersonClick}
          >
            Individual person
          </button>
        </div>
        {company && (
          <ul className='container'>
            {companies.map((company) => (
              <div className='list' onClick={() => handleSelectCompany(company._id)} key={company._id}>
                <img src='https://img.freepik.com/premium-vector/file-folder-icon-flat-style-documents-archive-vector-illustration-white-isolated-background-storage-business-concept_157943-627.jpg?uid=R102997587&ga=GA1.2.2142793496.1716934876&semt=sph' alt='' />
                <li style={{ cursor: 'pointer' }}>
                  {company.name}
                </li>
              </div>
            ))}
          </ul>
        )}

        {person && (
            <div className='container'>
              employees
            </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;


// CompanyForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../assets/style/companyForm.css'

const CompanyForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/companies/create', { name });
      console.log('Company created:', response.data);
      setName('');
    } catch (error) {
      console.error('Error creating company:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='company-form'>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Company Name"
        required
      />
      <button style={{background: '#870000'}} type="submit">Create Company</button>
    </form>
  );
};

export default CompanyForm;

// CompanyEmployees.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/style/companyEmployee.css';

const CompanyEmployees = ({ companyId }) => {
  const [employees, setEmployees] = useState([]);
  const [foodInputs, setFoodInputs] = useState({});
  const [tickStatus, setTickStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/companies/${companyId}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error.message);
      }
    };

    fetchEmployees();
  }, [companyId]);

  const handleTick = (employeeId) => {
    setTickStatus((prevStatus) => ({
      ...prevStatus,
      [employeeId]: !prevStatus[employeeId]
    }));
  };

  const handleFoodChange = (employeeId, food) => {
    setFoodInputs((prevInputs) => ({
      ...prevInputs,
      [employeeId]: food
    }));
  };

  const handleUpdateFood = async (employeeId) => {
    try {
      const foodTaken = foodInputs[employeeId];
      await axios.post('http://localhost:5000/api/companies/update-food', {
        employeeId,
        foodTaken
      });
      setFoodInputs((prevInputs) => ({
        ...prevInputs,
        [employeeId]: ''
      }));
    } catch (error) {
      console.error('Error updating food taken:', error.message);
    }
  };

  const handleSubmit = () => {
    const submittedEmployees = employees.filter(employee => tickStatus[employee._id]);
    const data = submittedEmployees.map(employee => ({
      ...employee,
      changedMeal: !!foodInputs[employee._id],
      foodTaken: foodInputs[employee._id] || employee.foodTaken
    }));

    navigate('/submitted-employees', { state: { data } });
  };

  return (
    <div className="container">
      <h2>Clients</h2>
      {employees.length > 0 ? (
        <>
          <ul className="employee-list">
            {employees.map((employee) => (
              <li key={employee._id} className="employee-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={tickStatus[employee._id] || false}
                    onChange={() => handleTick(employee._id)}
                  />
                  <span className="checkmark"></span>
                  {employee.name}
                </label>
                {tickStatus[employee._id] && (
                  <div className="food-inputs">
                    <input
                      type="text"
                      value={foodInputs[employee._id] || ''}
                      onChange={(e) => handleFoodChange(employee._id, e.target.value)}
                      placeholder="Food Taken?"
                      className="food-input"
                    />
                    <button className="update-food-btn" onClick={() => handleUpdateFood(employee._id)}>Update</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button className="submit-btn" onClick={handleSubmit}>Submit Ticked Employees</button>
        </>
      ) : (
        <p>No employees</p>
      )}
    </div>
  );
};

export default CompanyEmployees;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/companyForm.css'

const AddEmployeeForm = ({ companyId, companies = [], onAddEmployee }) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId || '');
  const [isIndividual, setIsIndividual] = useState(false);

  useEffect(() => {
    if (companyId) {
      setSelectedCompanyId(companyId);
    }
  }, [companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/companies/add-employee', {
        name,
        employeeId,
        companyId: isIndividual ? null : selectedCompanyId,
        isIndividual
      });
      console.log('Employee added:', response.data);
      setName('');
      setEmployeeId('');
      setIsIndividual(false);
      onAddEmployee(response.data);
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='company-form'>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        placeholder="ID"
        required
      />
      <label className='select-individual'>
        As Individual?
        <input
          type="checkbox"
          checked={isIndividual}
          onChange={(e) => setIsIndividual(e.target.checked)}
        />
      </label>
      {!isIndividual && (
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          required
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
      )}
      <button style={{background: '#01361D'}} type="submit">Add Employee</button>
    </form>
  );
};

export default AddEmployeeForm;

import React from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/style/submittedEmployees.css';

const SubmittedEmployees = () => {
  const location = useLocation();
  const { data } = location.state || { data: [] };

  return (
    <div className="container">
      <h2>Submitted Employees</h2>
      {data.length > 0 ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th style={{color: '#FFFCF8'}}>Name</th>
              <th style={{color: '#FFFCF8'}}>Employee ID</th>
              <th style={{color: '#FFFCF8'}}>Company</th>
              <th style={{color: '#FFFCF8'}}>Meal Status</th>
              <th style={{color: '#FFFCF8'}}>Food Taken</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee) => (
              <tr key={employee._id} className={employee.changedMeal ? 'changed-meal' : ''}>
                <td>{employee.name}</td>
                <td>{employee.employeeId}</td>
                <td>{employee.companyName}</td>
                <td>
                  {employee.changedMeal ? (
                    <button className="meal-button" onClick={() => alert(`Meal taken: ${employee.foodTaken}`)}>Changed Meal</button>
                  ) : (
                    'Same Meal'
                  )}
                </td>
                <td>{employee.foodTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees submitted</p>
      )}
    </div>
  );
};

export default SubmittedEmployees;

