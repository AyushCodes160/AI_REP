import PostedPost from '../models/PostedPost.js';
import { generateText } from '../utils/ai.js';

// @desc    Get weekly performance report
// @route   GET /api/analytics/weekly-report
// @access  Private
export const getWeeklyReport = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get posts from last week
    const posts = await PostedPost.find({
      userId: req.user._id,
      postedAt: { $gte: oneWeekAgo },
    });

    // Generate mock analytics
    const analytics = {
      totalPosts: posts.length,
      totalViews: posts.reduce((sum, post) => sum + (post.mockAnalytics?.views || 0), 0),
      totalLikes: posts.reduce((sum, post) => sum + (post.mockAnalytics?.likes || 0), 0),
      totalComments: posts.reduce((sum, post) => sum + (post.mockAnalytics?.comments || 0), 0),
      totalShares: posts.reduce((sum, post) => sum + (post.mockAnalytics?.shares || 0), 0),
      averageEngagement: 0,
      topPlatform: getTopPlatform(posts),
      postsByPlatform: getPostsByPlatform(posts),
    };

    analytics.averageEngagement =
      analytics.totalPosts > 0
        ? Math.round(
            ((analytics.totalLikes + analytics.totalComments + analytics.totalShares) /
              analytics.totalPosts) *
              100
          ) / 100
        : 0;

    // Generate AI summary and recommendations
    const summaryPrompt = `Analyze these social media analytics for the past week:
- Total Posts: ${analytics.totalPosts}
- Total Views: ${analytics.totalViews}
- Total Likes: ${analytics.totalLikes}
- Total Comments: ${analytics.totalComments}
- Total Shares: ${analytics.totalShares}
- Average Engagement: ${analytics.averageEngagement}
- Top Platform: ${analytics.topPlatform}

Provide a brief summary (2-3 sentences) and 3-5 growth recommendations.`;

    const aiSummary = await generateText({ prompt: summaryPrompt });

    res.json({
      analytics,
      summary: aiSummary,
      period: 'Last 7 days',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get top platform
const getTopPlatform = (posts) => {
  if (posts.length === 0) return 'N/A';
  const platformCounts = {};
  posts.forEach((post) => {
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
  });
  return Object.keys(platformCounts).reduce((a, b) =>
    platformCounts[a] > platformCounts[b] ? a : b
  );
};

// Helper function to get posts by platform
const getPostsByPlatform = (posts) => {
  const platformCounts = {};
  posts.forEach((post) => {
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
  });
  return platformCounts;
};

