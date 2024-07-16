
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
  companyName: { type: String },
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

module.exports = router;

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

// CompanyForm.js
import React, { useState } from 'react';
import axios from 'axios';

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Company Name"
        required
      />
      <button type="submit">Create Company</button>
    </form>
  );
};

export default CompanyForm;

// CompanyEmployees.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyEmployees = ({ companyId }) => {
  const [employees, setEmployees] = useState([]);
  const [tickStatus, setTickStatus] = useState({});

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

  return (
    <div>
      <h2>Employees of Company {companyId}</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>
            <label>
              <input
                type="checkbox"
                checked={tickStatus[employee._id] || false}
                onChange={() => handleTick(employee._id)}
              />
              {employee.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyEmployees;

// CompanyList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyList = ({ onSelectCompany, onAddNewCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');

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

  const handleAddCompany = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/companies/create', { name: newCompanyName });
      setCompanies([...companies, response.data]);
      setNewCompanyName('');
      onAddNewCompany(response.data._id);
    } catch (error) {
      console.error('Error adding company:', error.message);
    }
  };

  return (
    <div>
      <h2>Companies</h2>
      <ul>
        {companies.map((company) => (
          <li key={company._id} onClick={() => onSelectCompany(company._id)} style={{ cursor: 'pointer' }}>
            {company.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newCompanyName}
        onChange={(e) => setNewCompanyName(e.target.value)}
        placeholder="New Company Name"
      />
      <button onClick={handleAddCompany}>Add Company</button>
    </div>
  );
};

export default CompanyList;

// AddEmployeeForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeForm = ({ companyId, companies, onAddEmployee }) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [companyName, setCompanyName] = useState('');
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
        companyName,
        companyId: isIndividual ? null : selectedCompanyId,
        isIndividual
      });
      console.log('Employee added:', response.data);
      setName('');
      setEmployeeId('');
      setCompanyName('');
      setIsIndividual(false);
      onAddEmployee(response.data);
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Employee Name"
        required
      />
      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        placeholder="Employee ID"
        required
      />
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company"
      />
      <label>
        <input
          type="checkbox"
          checked={isIndividual}
          onChange={(e) => setIsIndividual(e.target.checked)}
        />
        Add as Individual
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
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default AddEmployeeForm;

// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanyForm from '../components/CompanyForm';
import AddEmployeeForm from '../components/AddEmployeeForm';
import CompanyList from '../components/CompanyList';
import CompanyEmployees from '../components/CompanyEmployees';

const Home = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [view, setView] = useState('companies');

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

  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
    setView('employees');
  };

  const handleAddNewCompany = (companyId) => {
    setSelectedCompany(companyId);
    setView('employees');
  };

  const handleAddEmployee = (employee) => {
    console.log('Employee added:', employee);
    // Optionally update the state or perform other actions after adding an employee
  };

  return (
    <div>
      <h1>Restaurant Management System</h1>
      {view === 'companies' && (
        <>
          <CompanyForm />
          <CompanyList onSelectCompany={handleCompanySelect} onAddNewCompany={handleAddNewCompany} />
          <AddEmployeeForm
            companyId={selectedCompany}
            companies={companies}
            onAddEmployee={handleAddEmployee}
          />
        </>
      )}
      {view === 'employees' && selectedCompany && (
        <CompanyEmployees companyId={selectedCompany} />
      )}
    </div>
  );
}; 

export default Home;


i want that if an employee took a plate which is 
different from what the company negotiated with the restaurant that they 
should take, an admin can click on that employee and just type the food he took that time, 
don't add the functions for negotiating what to eat no it's just an input
where an admin will type the food that employee took that time, about negotiating what to eat the 
companies and the restaurant will not use our system they'll talk face to face