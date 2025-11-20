import express from 'express';
import {
  getDrafts,
  getDraft,
  createDraft,
  updateDraft,
  deleteDraft,
} from '../controllers/draftController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/').get(getDrafts).post(createDraft);
router.route('/:id').get(getDraft).put(updateDraft).delete(deleteDraft);

export default router;

