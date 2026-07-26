import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    duration: { type: String, required: true },
    domain: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    message: { type: String, default: '' },
    userUid: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Under Review', 'Approved', 'Rejected', 'Completed'],
      default: 'Under Review'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Application', applicationSchema);
