import mongoose from 'mongoose';

const postedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    draftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draft',
    },
    scheduledPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScheduledPost',
    },
    platform: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    mockAnalytics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PostedPost', postedPostSchema);

