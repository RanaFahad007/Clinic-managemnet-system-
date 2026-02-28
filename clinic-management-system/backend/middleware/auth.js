const jwt = require('jsonwebtoken');
const User = require('../myschema/UserSchema');

// JWT Secret Key (should match the one in login-user.js)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        // If no token, check for simple authentication flag (for backward compatibility)
        if (!token) {
            // Allow request to proceed if it's a simple authentication check
            // In production, you should require JWT tokens
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Optionally fetch user from database
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Attach user to request object
        req.user = user;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        // Token verification failed
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired" 
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }
        // For backward compatibility, allow request to proceed
        // In production, you should return error
        next();
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'clinicAdmin') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin role required." 
    });
};

module.exports = { authenticateToken, requireAdmin };

