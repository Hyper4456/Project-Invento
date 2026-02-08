require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Import Models to ensure they are registered for sequelize.sync()
const User = require('./models/User');
const Company = require('./models/Company');
const Product = require('./models/Product');

// Import Routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory.routes');

// Crash if JWT_SECRET is missing to prevent security vulnerabilities
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 */
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/**
 * Routes Setup
 */
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes); // Registers the medicine vault endpoints

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Pharminto Backend is Running');
});

/**
 * Database Sync and Start Server
 * { alter: true } ensures existing tables are updated if you add new fields
 */
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully. Tables created/updated.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });