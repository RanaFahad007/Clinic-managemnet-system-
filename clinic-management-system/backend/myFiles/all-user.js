const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');

router.get('/', async (req, res) => {
    let mySuccess = false;
    
    try {
        const users = await User.find().select('-password');
        
        mySuccess = true;
        res.json({
            success: mySuccess,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(400).json({ 
            success: mySuccess, 
            message: "Internal Server Error" 
        });
    }
});

module.exports = router;


