import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, uppercase: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    courseTitle: { type: String, required: true },
    duration: { type: String, required: true },
    performanceGrade: { type: String, required: true },
    issueDate: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Certificate', certificateSchema);
