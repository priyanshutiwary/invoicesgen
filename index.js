import dotenv from 'dotenv';
import connectDB from './backend/db/index.js';

dotenv.config({ path: './env' });

connectDB();