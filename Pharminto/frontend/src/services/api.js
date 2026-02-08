import axios from 'axios';

const isCodespaces = window.location.hostname.includes('app.github.dev');

const API_BASE = isCodespaces
  ? `${window.location.protocol}//${window.location.hostname.replace(
      '-3000',
      '-5000'
    )}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
