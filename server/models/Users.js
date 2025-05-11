import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    nickname: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
