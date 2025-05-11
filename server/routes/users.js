import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/Users.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nickname } = req.body;
  const userId = uuidv4();

  const newUser = new User({ userId, nickname });
  await newUser.save();

  res.json({ userId, nickname });
});

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ userId: req.params.id });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

export default router;
