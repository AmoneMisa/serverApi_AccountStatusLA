import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nickname: {type: String, unique: true},
    settings: Object,
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
