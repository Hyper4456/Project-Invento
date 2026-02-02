# Pharminto MVP

A pharmaceutical distributor registration and login system.

## Quick Start

### Backend Setup
```bash
cd backend
npm install
node server.js
```

Server will run on http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:3000

## Features

- User registration with email and password
- User login with JWT authentication
- Password hashing with bcrypt
- SQLite database with Sequelize ORM
- React frontend with React Router
- Dashboard page after login

## Test Users

After starting both servers, navigate to http://localhost:3000

1. Register a new user (e.g., user@example.com / password123)
2. Login with those credentials
3. You will be redirected to the dashboard

## Tech Stack

- Backend: Node.js, Express, SQLite, Sequelize
- Frontend: React, React Router, Axios
- Auth: bcryptjs, jsonwebtoken
