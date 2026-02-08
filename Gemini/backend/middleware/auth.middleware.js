const jwt = require('jsonwebtoken');

/**
 * PATH: backend/middleware/auth.middleware.js
 * PURPOSE: Validates JWT tokens and extracts the 'tenantId' 
 * to ensure data isolation between different pharmaceutical companies.
 */

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: Missing Security Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        // We attach the companyId (tenantId) to the request
        // So the database knows WHICH company's inventory to fetch.
        req.tenantId = decoded.companyId; 
        
        next();
    } catch (err) {
        res.status(403).json({ error: 'Security Session Expired or Invalid' });
    }
};