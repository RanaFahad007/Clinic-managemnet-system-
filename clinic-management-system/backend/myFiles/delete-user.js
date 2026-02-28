const express = require('express');
const router = express.Router();
const User = require('../myschema/UserSchema');

//:reqID4Delete is for getting ID from endpoint
router.delete('/:reqID4Delete', async (req, res) => {
    let mySuccess = false;
    let delID = req.params.reqID4Delete;
    
    try {
        //getting the data that is being deleted. Data's ID will be in URL/API
        const getUser = await User.findById(delID);

        //sending response if there is no data in the database against requested-ID
        if (!getUser) {
            return res.status(404).json({ success: mySuccess, message: "No User Found for this ID" });
        }
        
        const deletedUser = await User.findByIdAndDelete(delID);

        //displaying success message and deleted-data
        mySuccess = true;
        let sendResponseData = {
            success: mySuccess,
            message: "User deleted successfully",
            deletedUser: {
                _id: deletedUser._id,
                email: deletedUser.email,
                role: deletedUser.role
            }
        };
        res.json(sendResponseData);
    } catch (e) {
        console.error('Delete error:', e);
        res.status(400).json({ success: mySuccess, message: "Internal Server Error", error: e.message });
    }
});

//exporting so that it can access from other files
module.exports = router;


