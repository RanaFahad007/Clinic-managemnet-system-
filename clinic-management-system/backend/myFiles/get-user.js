const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');

//:reqID is for getting ID from endpoint
router.get('/:reqID', async (req, res) => {
    let mySuccess = false;
    let userID = req.params.reqID;
    
    try {
        //getting the data by ID
        const getUser = await User.findById(userID).select('-password');

        //sending response if there is no data in the database against requested-ID
        if (!getUser) {
            return res.status(404).json({ success: mySuccess, message: "No User Found for this ID" });
        }

        mySuccess = true;
        let sendResponseData = {
            user: getUser,
            success: mySuccess,
            message: "User found successfully"
        };
        res.json(sendResponseData);
    } catch (e) {
        console.error('Get user error:', e);
        res.status(400).json({ success: mySuccess, message: "Internal Server Error", error: e.message });
    }
});

//exporting so that it can access from other files
module.exports = router;


