import cron from 'node-cron';
import ScheduledPost from '../models/ScheduledPost.js';
import PostedPost from '../models/PostedPost.js';
import Draft from '../models/Draft.js';

// Function to process scheduled posts
const processScheduledPosts = async () => {
  try {
    const now = new Date();
    
    // Find posts that should be posted now
    const postsToPost = await ScheduledPost.find({
      status: 'scheduled',
      scheduledTime: { $lte: now },
    });

    console.log(`\n⏰ [Cron Job] Checking scheduled posts at ${now.toISOString()}`);
    console.log(`📋 Found ${postsToPost.length} post(s) ready to be posted`);

    for (const scheduledPost of postsToPost) {
      // Generate mock analytics
      const mockAnalytics = {
        views: Math.floor(Math.random() * 10000) + 100,
        likes: Math.floor(Math.random() * 1000) + 10,
        comments: Math.floor(Math.random() * 100) + 1,
        shares: Math.floor(Math.random() * 50) + 1,
      };

      // Create posted post record
      const postedPost = await PostedPost.create({
        userId: scheduledPost.userId,
        draftId: scheduledPost.draftId,
        scheduledPostId: scheduledPost._id,
        platform: scheduledPost.platform,
        content: scheduledPost.content,
        postedAt: now,
        mockAnalytics,
      });

      // Update scheduled post status
      scheduledPost.status = 'posted';
      await scheduledPost.save();

      // Update draft status
      const draft = await Draft.findById(scheduledPost.draftId);
      if (draft) {
        draft.status = 'posted';
        await draft.save();
      }

      console.log(`✅ Posted to ${scheduledPost.platform} - Views: ${mockAnalytics.views}, Likes: ${mockAnalytics.likes}`);
    }

    if (postsToPost.length === 0) {
      console.log('ℹ️  No posts scheduled for this time');
    }
  } catch (error) {
    console.error('❌ Error processing scheduled posts:', error);
  }
};

// Start cron job - runs every minute
export const startCronJob = () => {
  console.log('🔄 Starting cron job scheduler (runs every minute)');
  
  // Run every minute
  cron.schedule('* * * * *', processScheduledPosts);
  
  // Also run immediately on startup
  processScheduledPosts();
};

