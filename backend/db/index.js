import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;


const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected successfully DB HOST: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error);
        process.exit(1);
    }
}

export default connectDB;