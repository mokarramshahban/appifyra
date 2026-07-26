import express from 'express';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { sendEmail, contactReceivedTemplate, inquiryStatusTemplate } from '../services/emailService.js';

const router = express.Router();

const findInq = async (id, email) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Inquiry.findById(id);
  }
  if (id) {
    const foundById = await Inquiry.findOne({ id: id });
    if (foundById) return foundById;
  }
  if (email) {
    return await Inquiry.findOne({ email: email });
  }
  return null;
};

const updateInq = async (id, updateData) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const updated = await Inquiry.findByIdAndUpdate(id, updateData, { new: true });
    if (updated) return updated;
  }

  if (id) {
    const updatedById = await Inquiry.findOneAndUpdate({ id: id }, updateData, { new: true });
    if (updatedById) return updatedById;
  }

  if (updateData.email) {
    return await Inquiry.findOneAndUpdate(
      { email: updateData.email },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  return null;
};

const deleteInq = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Inquiry.findByIdAndDelete(id);
  }
  return await Inquiry.findOneAndDelete({ id: id });
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
    const oldInquiry = await findInq(id, req.body.email);
    const updated = await updateInq(id, req.body);

    const targetEmail = req.body.email || updated?.email;
    const targetName = req.body.fullName || updated?.fullName;
    const targetStatus = req.body.status || updated?.status || 'New';
    const targetService = req.body.serviceType || req.body.subject || updated?.serviceType || 'Development Services';

    // Send email update to client if status or note changed
    if (targetEmail && targetName) {
      sendEmail({
        to: targetEmail,
        ...inquiryStatusTemplate({
          fullName: targetName,
          serviceType: targetService,
          status: targetStatus,
          message: req.body.customNote || updated?.adminNotes || ''
        })
      }).catch(err => console.error('Inquiry update email error:', err));
    }

    res.json({ success: true, data: updated || req.body });
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
