const Product = require('../models/Product');

/**
 * PATH: backend/controllers/inventoryController.js
 * PURPOSE: Logic for handling medicine stock within a secured tenant environment.
 */

exports.getInventory = async (req, res) => {
    try {
        // We filter by req.tenantId (set by the middleware)
        // This prevents Company A from seeing Company B's stock.
        const products = await Product.findAll({
            where: { companyId: req.tenantId }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve vault data.' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, sku, stock, priceUSD } = req.body;
        
        const product = await Product.create({
            name,
            sku,
            stock,
            priceUSD,
            companyId: req.tenantId // Automatically tag with the user's company
        });
        
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid product data or SKU already exists.' });
    }
};