import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    idea: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    script: {
      type: String,
      default: '',
    },
    platform: {
      type: String,
      enum: ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'posted'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Draft', draftSchema);

