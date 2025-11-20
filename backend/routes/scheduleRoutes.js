import express from 'express';
import {
  schedulePost,
  getScheduledPosts,
  cancelScheduledPost,
} from '../controllers/scheduleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/').get(getScheduledPosts).post(schedulePost);
router.delete('/:id', cancelScheduledPost);

export default router;

