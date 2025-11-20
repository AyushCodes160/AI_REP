import mongoose from 'mongoose';

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    platform: {
      type: String,
      enum: ['youtube', 'twitter', 'instagram', 'tiktok', 'linkedin'],
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
    isConnected: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SocialAccount', socialAccountSchema);

