import express from 'express';
import Subscription from '../models/Subscription.js';
import User from '../models/Users.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { from, to } = req.body;
    const existing = await Subscription.findOne({ from, to });
    if (existing) {
        return res.status(400).json({ error: 'Already subscribed' });
    }

    await new Subscription({ from, to }).save();
    res.json({ success: true });
});

router.get('/:userId', async (req, res) => {
    const subscriptions = await Subscription.find({ from: req.params.userId });
    const userIds = subscriptions.map(sub => sub.to);
    const users = await User.find({ userId: { $in: userIds } });
    res.json(users);
});

export default router;
