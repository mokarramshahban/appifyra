import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Application from './models/Application.js';
import Inquiry from './models/Inquiry.js';
import Certificate from './models/Certificate.js';
import Subscriber from './models/Subscriber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'appifyra',
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Seed Sample Application
    const sampleApp = await Application.findOneAndUpdate(
      { email: 'student.sample@gmail.com' },
      {
        fullName: 'Mokarram Shahban',
        email: 'student.sample@gmail.com',
        phone: '+91 9876543210',
        college: 'LNM University',
        degree: 'B.Tech CS',
        duration: '45-Days',
        domain: 'Web Development',
        status: 'Approved',
        userUid: 'sample_student_001'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Application collection initialized:', sampleApp._id);

    // 2. Seed Sample Certificate
    const sampleCert = await Certificate.findOneAndUpdate(
      { certificateId: 'APP-2026-001' },
      {
        certificateId: 'APP-2026-001',
        studentName: 'Mokarram Shahban',
        studentEmail: 'smokarram07@gmail.com',
        courseTitle: 'Web Development (45-Days)',
        performanceGrade: 'Excellence (A+)',
        issueDate: 'July 26, 2026',
        skills: ['React.js', 'JavaScript', 'HTML/CSS', 'REST APIs'],
        status: 'Active',
        issuer: 'Appifyra Certification Board'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Certificate collection initialized:', sampleCert.certificateId);

    // 3. Seed Sample Inquiry
    const sampleInquiry = await Inquiry.findOneAndUpdate(
      { email: 'inquiry.sample@gmail.com' },
      {
        fullName: 'Mokarram Shahban',
        email: 'inquiry.sample@gmail.com',
        subject: 'Web Development Project Inquiry',
        message: 'Looking for a React + Node.js web application solution.',
        userUid: 'sample_user_001'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Inquiry collection initialized:', sampleInquiry._id);

    // 4. Seed Sample Subscriber
    const sampleSub = await Subscriber.findOneAndUpdate(
      { email: 'smokarram07@gmail.com' },
      { email: 'smokarram07@gmail.com' },
      { upsert: true, new: true }
    );
    console.log('✅ Subscriber collection initialized:', sampleSub.email);

    console.log('🚀 SUCCESS! "appifyra" database and collections are now live in MongoDB Atlas Cluster0!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
