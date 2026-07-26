import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

// POST /api/subscribers -> Save New Subscriber Email
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let sub = await Subscriber.findOne({ email: cleanEmail });
    if (!sub) {
      sub = new Subscriber({ email: cleanEmail });
      await sub.save();
    }

    res.status(201).json({ success: true, id: sub._id, data: sub });
  } catch (error) {
    console.error('Error saving subscriber:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subscribers -> Get All Subscribers
router.get('/', async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ subscribedAt: -1 });
    const formatted = subs.map(doc => ({
      id: doc._id.toString(),
      ...doc.toObject()
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/subscribers/:id -> Update Subscriber Email
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const updated = await Subscriber.findByIdAndUpdate(id, { email: email.trim().toLowerCase() }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/subscribers/:id -> Delete Subscriber Record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Subscriber.findByIdAndDelete(id);
    res.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
