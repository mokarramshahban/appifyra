import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'Service Request' },
    serviceType: { type: String, default: 'General Inquiry' },
    budget: { type: String, default: 'Flexible' },
    message: { type: String, required: true },
    status: { type: String, default: 'New' }, // 'New', 'In Contact', 'In Progress', 'Completed', 'Closed'
    adminNotes: { type: String, default: '' },
    userUid: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Inquiry', inquirySchema);
