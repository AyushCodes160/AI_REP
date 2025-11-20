import mongoose from 'mongoose';

const scheduledPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    draftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draft',
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'posted', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ScheduledPost', scheduledPostSchema);

