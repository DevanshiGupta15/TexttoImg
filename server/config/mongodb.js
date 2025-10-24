import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/imagify';  // Provide a default valid URI
        if (!uri || uri === 'undefined') {
            throw new Error('Invalid MongoDB URI. Check your .env file.');
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);  // Optional: Exit on failure
    }
};

export default connectDB;