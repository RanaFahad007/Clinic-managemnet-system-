const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    let mySuccess = false;
    
    try {
        const { email, password, role, ownerName, clinicName, name, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: mySuccess, 
                message: "User with this email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object based on role
        const userData = {
            email,
            password: hashedPassword,
            role,
            phone: phone || '',
            address: address || ''
        };

        if (role === 'clinicAdmin') {
            userData.ownerName = ownerName || '';
            userData.clinicName = clinicName || '';
        } else if (role === 'patient') {
            userData.name = name || '';
        }

        const newUser = new User(userData);
        await newUser.save();

        mySuccess = true;
        res.status(201).json({
            success: mySuccess,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                ownerName: newUser.ownerName,
                clinicName: newUser.clinicName,
                name: newUser.name,
                phone: newUser.phone,
                address: newUser.address
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ 
            success: mySuccess, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

module.exports = router;


