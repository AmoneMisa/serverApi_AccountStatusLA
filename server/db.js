import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI)
export async function connectToDatabase() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
}
