import express from 'express';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { sendEmail, contactReceivedTemplate, inquiryStatusTemplate } from '../services/emailService.js';

const router = express.Router();

const findInq = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Inquiry.findById(id);
  }
  return await Inquiry.findOne({ $or: [{ _id: id }, { id: id }] });
};

const updateInq = async (id, updateData) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Inquiry.findByIdAndUpdate(id, updateData, { new: true });
  }
  const found = await Inquiry.findOne({ $or: [{ _id: id }, { id: id }] });
  if (found) {
    return await Inquiry.findByIdAndUpdate(found._id, updateData, { new: true });
  }
  return null;
};

const deleteInq = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Inquiry.findByIdAndDelete(id);
  }
  const found = await Inquiry.findOne({ $or: [{ _id: id }, { id: id }] });
  if (found) {
    return await Inquiry.findByIdAndDelete(found._id);
  }
  return null;
};

// POST /api/inquiries -> Save Contact/Service Message & Send Confirmation Email
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    const savedInquiry = await inquiry.save();

    // Send confirmation email to client/user (non-blocking)
    if (savedInquiry.email && savedInquiry.fullName) {
      sendEmail({
        to: savedInquiry.email,
        ...contactReceivedTemplate({
          fullName: savedInquiry.fullName,
          subject: savedInquiry.subject,
          serviceType: savedInquiry.serviceType
        })
      }).catch(err => console.error('Inquiry submit email error:', err));
    }

    res.status(201).json({ success: true, id: savedInquiry._id.toString(), data: savedInquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/inquiries -> Get All Inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    const formatted = inquiries.map(doc => ({
      id: doc._id.toString(),
      ...doc.toObject()
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/inquiries/:id -> Update Inquiry Details & Status & Send Email to Client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldInquiry = await findInq(id);
    const updated = await updateInq(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Send email update to client if status or note changed
    if (updated.email && (oldInquiry?.status !== updated.status || req.body.sendNotification)) {
      sendEmail({
        to: updated.email,
        ...inquiryStatusTemplate({
          fullName: updated.fullName,
          serviceType: updated.serviceType || updated.subject,
          status: updated.status,
          message: req.body.customNote || updated.adminNotes || ''
        })
      }).catch(err => console.error('Inquiry update email error:', err));
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/inquiries/:id -> Delete Inquiry Record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteInq(id);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
