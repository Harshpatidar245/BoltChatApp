import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { roomId, username, content } = req.body;

    if (!roomId || !username || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = new Message({ roomId, username, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
