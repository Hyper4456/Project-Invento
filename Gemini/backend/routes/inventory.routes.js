const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticateTenant = require('../middleware/auth.middleware');

/**
 * PATH: backend/routes/inventory.routes.js
 * PURPOSE: Defines the URL paths for inventory actions.
 */

// All routes here require the user to be logged in (authenticateTenant)
router.get('/', authenticateTenant, inventoryController.getInventory);
router.post('/add', authenticateTenant, inventoryController.addProduct);

module.exports = router;