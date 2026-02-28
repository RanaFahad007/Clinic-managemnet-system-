const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinic-management-system';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB successfully');
        console.log('📊 Database: clinic-management-system');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectToMongo;

