import express from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { sendEmail, appReceivedTemplate, statusUpdateTemplate } from '../services/emailService.js';

const router = express.Router();

// Helper to safely find application by Mongo ObjectId or custom string ID
const findApp = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Application.findById(id);
  }
  return await Application.findOne({ $or: [{ _id: id }, { id: id }] });
};

// Helper to safely update application
const updateApp = async (id, updateData) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Application.findByIdAndUpdate(id, updateData, { new: true });
  }
  const found = await Application.findOne({ $or: [{ _id: id }, { id: id }] });
  if (found) {
    return await Application.findByIdAndUpdate(found._id, updateData, { new: true });
  }
  return null;
};

// Helper to safely delete application
const deleteApp = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Application.findByIdAndDelete(id);
  }
  const found = await Application.findOne({ $or: [{ _id: id }, { id: id }] });
  if (found) {
    return await Application.findByIdAndDelete(found._id);
  }
  return null;
};

// POST /api/applications -> Save Application & Send Automatic Candidate Email
router.post('/', async (req, res) => {
  try {
    const app = new Application(req.body);
    const savedApp = await app.save();

    // Automatically send confirmation email to student (non-blocking)
    if (savedApp.email && savedApp.fullName) {
      sendEmail({
        to: savedApp.email,
        ...appReceivedTemplate({
          studentName: savedApp.fullName,
          domain: savedApp.domain || 'Software Track',
          duration: savedApp.duration || '45-Days'
        })
      }).catch(err => console.error('App submit email error:', err));
    }

    res.status(201).json({ success: true, id: savedApp._id.toString(), data: savedApp });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications -> Get All Applications
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    const formatted = apps.map(doc => ({
      id: doc._id.toString(),
      ...doc.toObject()
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications/student/:email -> Get Applications for Student
router.get('/student/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const apps = await Application.find({ email: email }).sort({ createdAt: -1 });
    const formatted = apps.map(doc => ({
      id: doc._id.toString(),
      ...doc.toObject()
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/applications/:id -> Update Application Details & Send Email if Status Changed
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldApp = await findApp(id);
    const updated = await updateApp(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Automatically send status update email if status or details changed
    if (updated.email && (oldApp?.status !== updated.status || req.body.sendEmailNotification)) {
      sendEmail({
        to: updated.email,
        ...statusUpdateTemplate({
          studentName: updated.fullName,
          status: updated.status,
          domain: updated.domain,
          duration: updated.duration
        })
      }).catch(err => console.error('Status email error:', err));
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/applications/:id/status -> Update Application Status & Send Email
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateApp(id, { status });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Automatically send email on status update
    if (updated.email && updated.fullName) {
      sendEmail({
        to: updated.email,
        ...statusUpdateTemplate({
          studentName: updated.fullName,
          status: updated.status,
          domain: updated.domain,
          duration: updated.duration
        })
      }).catch(err => console.error('Status patch email error:', err));
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/applications/:id -> Delete Application Record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteApp(id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
