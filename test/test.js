// Home.js
import React from 'react';
import HomeClass from '../components/HomeClass';
import AddButton from '../components/addButton';

const Home = () => {

  return (
    <div style={{background:'#FFFCF8'}}>
      <AddButton/>
      <section id='section1'>
        <HomeClass/>
      </section>
    </div>
  );
};

export default Home;


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
  const [newCompanyName, setNewCompanyName] = useState('');
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

  const handleAddCompany = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/companies/create', { name: newCompanyName });
      setCompanies([...companies, response.data]);
      setNewCompanyName('');
      if (onAddNewCompany) {
        onAddNewCompany(response.data._id);
      }
    } catch (error) {
      console.error('Error adding company:', error.message);
    }
  };

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
      <AddButton />
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
            <h1>Cyusa</h1>
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

// CompanyEmployees.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            {tickStatus[employee._id] && (
              <div>
                <button onClick={() => handleFoodChange(employee._id, '')}>
                  Add Food Taken
                </button>
                {foodInputs[employee._id] !== undefined && (
                  <div>
                    <input
                      type="text"
                      value={foodInputs[employee._id] || ''}
                      onChange={(e) => handleFoodChange(employee._id, e.target.value)}
                      placeholder="Food Taken"
                    />
                    <button onClick={() => handleUpdateFood(employee._id)}>Update Food</button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit Ticked Employees</button>
    </div>
  );
};

export default CompanyEmployees;


// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import DashboardLayout from './layouts/dashboard-layout';
import SignInPage from './routes/sign-in';
import SignUpPage from './routes/sign-up';
import Home from './pages/Home';
import AddEmployeeForm from './components/AddEmployeeForm';
import CompanyForm from './components/CompanyForm';
import CompanyList from './components/CompanyList';
import SubmittedEmployees from './components/SubmittedEmployees';
import AddBetweenForms from './components/AddBetweenForms.js';
import CompanyEmployees from './components/CompanyEmployees';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> }, 
      {
        element: <DashboardLayout />,
        children: [
          { path: "/add-employee", element: <AddEmployeeForm /> },
          { path: "/company-form", element: <CompanyForm /> },
          { path: "/company-list", element: <CompanyList /> },
          { path: "/submitted-employees", element: <SubmittedEmployees /> },
          { path: "/addBetween", element: <AddBetweenForms /> },
          { path: "/company/:companyId/employees", element: <CompanyEmployees /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


