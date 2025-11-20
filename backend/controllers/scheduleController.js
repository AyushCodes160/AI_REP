import ScheduledPost from '../models/ScheduledPost.js';
import PostedPost from '../models/PostedPost.js';
import Draft from '../models/Draft.js';

// @desc    Schedule a post
// @route   POST /api/schedule
// @access  Private
export const schedulePost = async (req, res) => {
  try {
    const { draftId, scheduledTime, platform } = req.body;

    if (!draftId || !scheduledTime || !platform) {
      return res.status(400).json({ message: 'Please provide draftId, scheduledTime, and platform' });
    }

    const draft = await Draft.findOne({ _id: draftId, userId: req.user._id });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    const content = draft.caption || draft.script || draft.idea;

    const scheduledPost = await ScheduledPost.create({
      userId: req.user._id,
      draftId,
      platform,
      content,
      scheduledTime: new Date(scheduledTime),
      status: 'scheduled',
    });

    // Update draft status
    draft.status = 'scheduled';
    await draft.save();

    res.status(201).json(scheduledPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all scheduled posts
// @route   GET /api/schedule
// @access  Private
export const getScheduledPosts = async (req, res) => {
  try {
    const posts = await ScheduledPost.find({
      userId: req.user._id,
      status: 'scheduled',
    })
      .populate('draftId')
      .sort({ scheduledTime: 1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel scheduled post
// @route   DELETE /api/schedule/:id
// @access  Private
export const cancelScheduledPost = async (req, res) => {
  try {
    const post = await ScheduledPost.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ message: 'Scheduled post not found' });
    }

    post.status = 'cancelled';
    await post.save();

    // Update draft status back to draft
    const draft = await Draft.findById(post.draftId);
    if (draft) {
      draft.status = 'draft';
      await draft.save();
    }

    res.json({ message: 'Scheduled post cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

