import express from 'express';
import Application from '../models/Application.js';

const router = express.Router();

// POST /api/applications -> Save Application
router.post('/', async (req, res) => {
  try {
    const app = new Application(req.body);
    const savedApp = await app.save();
    res.status(201).json({ success: true, id: savedApp._id, data: savedApp });
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

// PUT /api/applications/:id -> Update Application Details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Application.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/applications/:id/status -> Update Application Status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
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
    await Application.findByIdAndDelete(id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
