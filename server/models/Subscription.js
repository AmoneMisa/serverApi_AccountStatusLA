import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    from: String,
    to: String
});

export default mongoose.model('Subscription', subscriptionSchema);
