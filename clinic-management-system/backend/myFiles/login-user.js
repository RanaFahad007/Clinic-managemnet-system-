const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret Key (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/', async (req, res) => {
    let mySuccess = false;
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: mySuccess, 
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: mySuccess, 
                message: "Invalid email or password" 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: mySuccess, 
                message: "Invalid email or password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        mySuccess = true;
        res.json({
            success: mySuccess,
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                ownerName: user.ownerName,
                clinicName: user.clinicName,
                name: user.name,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            success: mySuccess, 
            message: "Internal Server Error" 
        });
    }
});

module.exports = router;


