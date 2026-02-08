import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <p>Welcome to Pharminto Distributor Portal.</p>
            <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;