import express from 'express';
import {
  generateCaptionHandler,
  generateScriptHandler,
  generateScheduleHandler,
  generateIdeasHandler,
  rewriteContentHandler,
  getAIStatusHandler,
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/status', getAIStatusHandler);
router.post('/generate-caption', generateCaptionHandler);
router.post('/generate-script', generateScriptHandler);
router.post('/schedule-suggestions', generateScheduleHandler);
router.post('/content-ideas', generateIdeasHandler);
router.post('/rewrite', rewriteContentHandler);

export default router;
