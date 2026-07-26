import express from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { sendEmail, appReceivedTemplate, statusUpdateTemplate } from '../services/emailService.js';

const router = express.Router();

// Helper to safely find application by Mongo ObjectId or custom ID / email
const findApp = async (id, email) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Application.findById(id);
  }
  if (id) {
    const foundById = await Application.findOne({ id: id });
    if (foundById) return foundById;
  }
  if (email) {
    return await Application.findOne({ email: email });
  }
  return null;
};

// Helper to safely update application or upsert if legacy local record
const updateApp = async (id, updateData) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const updated = await Application.findByIdAndUpdate(id, updateData, { new: true });
    if (updated) return updated;
  }

  if (id) {
    const updatedById = await Application.findOneAndUpdate({ id: id }, updateData, { new: true });
    if (updatedById) return updatedById;
  }

  if (updateData.email) {
    // Upsert into MongoDB if legacy local record being updated for first time
    return await Application.findOneAndUpdate(
      { email: updateData.email, domain: updateData.domain },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  return null;
};

// Helper to safely delete application
const deleteApp = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Application.findByIdAndDelete(id);
  }
  return await Application.findOneAndDelete({ id: id });
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
    const oldApp = await findApp(id, req.body.email);
    const updated = await updateApp(id, req.body);

    const targetEmail = req.body.email || updated?.email;
    const targetName = req.body.fullName || updated?.fullName;
    const targetStatus = req.body.status || updated?.status || 'Under Review';
    const targetDomain = req.body.domain || updated?.domain || 'Software Track';
    const targetDuration = req.body.duration || updated?.duration || '45-Days';

    // Automatically send status update email if status or details changed
    if (targetEmail && targetName) {
      sendEmail({
        to: targetEmail,
        ...statusUpdateTemplate({
          studentName: targetName,
          status: targetStatus,
          domain: targetDomain,
          duration: targetDuration
        })
      }).catch(err => console.error('Status email error:', err));
    }

    res.json({ success: true, data: updated || req.body });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/applications/:id/status -> Update Application Status & Send Email
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, email, fullName, domain, duration } = req.body;
    const oldApp = await findApp(id, email);
    const updated = await updateApp(id, { status });

    const targetEmail = email || updated?.email || oldApp?.email;
    const targetName = fullName || updated?.fullName || oldApp?.fullName;
    const targetDomain = domain || updated?.domain || oldApp?.domain || 'Software Track';
    const targetDuration = duration || updated?.duration || oldApp?.duration || '45-Days';

    // Automatically send email on status update
    if (targetEmail && targetName) {
      sendEmail({
        to: targetEmail,
        ...statusUpdateTemplate({
          studentName: targetName,
          status: status,
          domain: targetDomain,
          duration: targetDuration
        })
      }).catch(err => console.error('Status patch email error:', err));
    }

    res.json({ success: true, data: updated || { id, status } });
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
