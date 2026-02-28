const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');
const bcrypt = require('bcryptjs');

//:reqID4Update is for getting ID from endpoint
router.put('/:reqID4Update', async (req, res) => {
    let mySuccess = false;
    let updateID = req.params.reqID4Update;
    
    try {
        //getting the data that is being updated. Data's ID will be in URL/API
        const getUser = await User.findById(updateID);

        //sending response if there is no data in the database against requested-ID
        if (!getUser) {
            return res.status(404).json({ success: mySuccess, message: "No User Found for this ID" });
        }

        // Prepare update data
        const updateData = { ...req.body };
        
        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // Remove _id from update data if present
        delete updateData._id;

        const updatedUser = await User.findByIdAndUpdate(
            updateID,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        //displaying success message and updated-data
        mySuccess = true;
        let sendResponseData = {
            success: mySuccess,
            message: "User updated successfully",
            user: updatedUser
        };
        res.json(sendResponseData);
    } catch (e) {
        console.error('Update error:', e);
        res.status(400).json({ success: mySuccess, message: "Internal Server Error", error: e.message });
    }
});

//exporting so that it can access from other files
module.exports = router;


