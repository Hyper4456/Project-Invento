import axios from 'axios';

// Dynamic Base URL detection for Localhost vs Codespaces
const getBaseUrl = () => {
    const { hostname, protocol } = window.location;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }

    // GitHub Codespaces (port 3000 -> 5000)
    if (hostname.endsWith('app.github.dev')) {
        // Replace the frontend port (3000) with backend port (5000) in the URL
        const newHostname = hostname.replace('-3000', '-5000');
        return `${protocol}//${newHostname}/api`;
    }

    // Fallback/Production
    return '/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the JWT token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;