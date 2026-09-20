import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Subscriber', subscriberSchema);
