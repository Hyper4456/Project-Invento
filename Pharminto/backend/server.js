require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔑 CORS MUST BE FIRST
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight
app.options('*', cors());

// Body parser
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pharminto API is running' });
});

// Routes
app.use('/api/auth', authRoutes);

// Start server
sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});
