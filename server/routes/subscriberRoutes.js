import express from 'express';
import mongoose from 'mongoose';
import Subscriber from '../models/Subscriber.js';
import { sendEmail, newsletterWelcomeTemplate } from '../services/emailService.js';

const router = express.Router();

const updateSub = async (id, email) => {
  const cleanEmail = email.trim().toLowerCase();
  if (mongoose.Types.ObjectId.isValid(id)) {
    const updated = await Subscriber.findByIdAndUpdate(id, { email: cleanEmail }, { new: true });
    if (updated) return updated;
  }
  return await Subscriber.findOneAndUpdate(
    { email: cleanEmail },
    { email: cleanEmail },
    { upsert: true, new: true }
  );
};

const deleteSub = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Subscriber.findByIdAndDelete(id);
  }
  return await Subscriber.findOneAndDelete({ $or: [{ id: id }, { email: id.trim().toLowerCase() }] });
};

// POST /api/subscribers -> Save New Subscriber Email & Send Welcome Email
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let sub = await Subscriber.findOne({ email: cleanEmail });
    let isNew = false;
    if (!sub) {
      sub = new Subscriber({ email: cleanEmail });
      await sub.save();
      isNew = true;
    }

    res.status(201).json({ success: true, id: sub._id.toString(), data: sub });

    // Send welcome email on subscription (non-blocking background)
    if (isNew) {
      sendEmail({
        to: cleanEmail,
        ...newsletterWelcomeTemplate({ email: cleanEmail })
      }).catch(err => console.error('Subscriber welcome email error:', err));
    }
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
    const updated = await updateSub(id, email);
    res.json({ success: true, data: updated || { id, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/subscribers/:id -> Delete Subscriber Record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSub(id);
    res.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
