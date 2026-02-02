require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Pharminto API is running' });
});

app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
