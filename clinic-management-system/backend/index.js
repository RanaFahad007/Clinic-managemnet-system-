require('dotenv').config(); // Load environment variables

const myConnectionToDB = require('./db'); //getting connectToMongo() from db.js that was exported
//running above required-code
myConnectionToDB();

const express = require('express');

//adding package that will allow communication with frontend
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//allowing communication on base of json
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

//route for all-user
app.use('/api/user/all-user', require('./myFiles/all-user')); //displaying all user
//route for get single user
app.use('/api/user/get-user', require('./myFiles/get-user'));
//route for register-user
app.use('/api/auth/register', require('./myFiles/register-user'));
//route for login-user
app.use('/api/auth/login', require('./myFiles/login-user'));
//route for logout-user
app.use('/api/auth/logout', require('./myFiles/logout-user'));
//route for delete-user
app.use('/api/user/delete-user', require('./myFiles/delete-user'));
//route for update-user
app.use('/api/user/update-user', require('./myFiles/update-user'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});

