// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Rejister';
import './App.css';

// Dashboard සඳහා dummy components සාදමු
const UserDashboard = () => <h2>User Dashboard</h2>;
const CompanyDashboard = () => <h2>Company Dashboard</h2>;
const AdminDashboard = () => <h2>Admin Dashboard</h2>;

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes. මේවා පසුව protected routes ලෙස වෙනස් කළ යුතුයි */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Default Route */}
          <Route path="/" element={<p>Welcome to the Website!</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;