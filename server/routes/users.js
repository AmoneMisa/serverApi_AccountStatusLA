import express from 'express';
import User from '../models/Users.js';

const router = express.Router();

router.put('/update/:id', async (req, res) => {
    const {nickname, settings} = req.body;

    const updatedUser = await User.findOne({_id: req.params.id});
    if (!updatedUser) {
        return res.status(404).json({error: 'User not found'});
    }

    await User.findOneAndUpdate(
        {_id: req.params.id},
        {nickname, settings, lastUpdateAt: Date.now()},
        {new: true});

    res.json({_id: updatedUser["_id"], nickname, settings});
});

router.post('/register', async (req, res) => {
    const {nickname, settings} = req.body;

    const newUser = new User({nickname, settings});
    await newUser.save();

    res.json({_id: newUser["_id"], nickname, settings});
});

router.get('/all', async (req, res) => {
    const users = await User.find({
        _id: { $ne: req.query.exclude }
    });
    if (!users) {
        return res.status(404).json({error: 'Users not found'});
    }
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findOne({_id: req.params.id});
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
});

export default router;
