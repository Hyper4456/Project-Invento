import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Pharminto</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        
        <div className="dashboard-body">
          <p>Hello, <strong>{user.email}</strong>!</p>
          <p>You are logged in as a <strong>{user.role}</strong>.</p>
          <p>This is your pharmaceutical distributor dashboard.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
