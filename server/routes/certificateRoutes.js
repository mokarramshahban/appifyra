import express from 'express';
import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';
import { sendEmail, certIssuedTemplate } from '../services/emailService.js';

const router = express.Router();

// Helpers for safe Mongo ObjectId vs custom Certificate ID string handling
const findCert = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Certificate.findById(id);
  }
  return await Certificate.findOne({ certificateId: id.trim().toUpperCase() });
};

const updateCert = async (id, updateData) => {
  const cleanCertId = (updateData.certificateId || id).trim().toUpperCase();
  if (mongoose.Types.ObjectId.isValid(id)) {
    const updated = await Certificate.findByIdAndUpdate(id, updateData, { new: true });
    if (updated) return updated;
  }
  return await Certificate.findOneAndUpdate(
    { certificateId: cleanCertId },
    updateData,
    { upsert: true, new: true }
  );
};

const deleteCert = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Certificate.findByIdAndDelete(id);
  }
  return await Certificate.findOneAndDelete({ certificateId: id.trim().toUpperCase() });
};

// GET /api/certificates -> Get All Issued Certificates
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    const formatted = certs.map(c => ({
      id: c._id.toString(),
      ...c.toObject()
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/certificates/next-id -> Auto-generate next sequential Certificate ID
router.get('/next-id', async (req, res) => {
  try {
    const count = await Certificate.countDocuments();
    const year = new Date().getFullYear();
    const nextSeq = String(count + 1).padStart(3, '0');
    res.json({ success: true, certificateId: `APP-${year}-${nextSeq}` });
  } catch (error) {
    console.error('Error generating next Certificate ID:', error);
    const randomNum = Math.floor(100 + Math.random() * 900);
    res.json({ success: true, certificateId: `APP-2026-${randomNum}` });
  }
});

// POST /api/certificates/issue -> Issue New Certificate & Send Email
router.post('/issue', async (req, res) => {
  try {
    const { certificateId, studentName, studentEmail, courseTitle, domain, duration, performanceGrade, issueDate } = req.body;
    const cleanId = certificateId.trim().toUpperCase();

    const cert = await Certificate.findOneAndUpdate(
      { certificateId: cleanId },
      {
        certificateId: cleanId,
        studentName,
        studentEmail,
        courseTitle: courseTitle || domain,
        duration: duration || '45-Days',
        performanceGrade: performanceGrade || req.body.grade || 'Excellence (A+)',
        issueDate: issueDate || new Date().toLocaleDateString(),
        issuedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Respond immediately so UI doesn't hang
    res.status(201).json({ success: true, certId: cert.certificateId, data: cert });

    // Send automated certificate email to candidate (non-blocking background)
    if (cert.studentEmail && cert.studentName) {
      sendEmail({
        to: cert.studentEmail,
        ...certIssuedTemplate({
          studentName: cert.studentName,
          certificateId: cert.certificateId,
          domain: cert.courseTitle || domain || 'Software Internship',
          grade: cert.performanceGrade,
          issueDate: cert.issueDate
        })
      }).catch(err => console.error('Certificate email trigger error:', err));
    }
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/certificates/:id -> Update Issued Certificate & Send Email
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCert(id, req.body);

    res.json({ success: true, data: updated || req.body });

    // Send updated Certificate email to student (non-blocking background)
    const targetEmail = req.body.studentEmail || updated?.studentEmail;
    const targetName = req.body.studentName || updated?.studentName;
    if (targetEmail && targetName) {
      sendEmail({
        to: targetEmail,
        ...certIssuedTemplate({
          studentName: targetName,
          certificateId: req.body.certificateId || updated?.certificateId || id,
          domain: req.body.courseTitle || req.body.domain || updated?.courseTitle || 'Software Internship',
          grade: req.body.performanceGrade || req.body.grade || updated?.performanceGrade || 'Excellence (A+)',
          issueDate: req.body.issueDate || updated?.issueDate || new Date().toLocaleDateString()
        })
      }).catch(err => console.error('Cert edit email trigger error:', err));
    }
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/certificates/:id -> Delete Issued Certificate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCert(id);
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/certificates/:id -> Lookup Certificate Credential
router.get('/:id', async (req, res) => {
  try {
    const cleanId = req.params.id.trim().toUpperCase();
    const cert = await Certificate.findOne({ certificateId: cleanId });
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, data: cert });
  } catch (error) {
    console.error('Error looking up certificate:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
