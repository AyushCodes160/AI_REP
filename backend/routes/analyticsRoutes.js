import express from 'express';
import { getWeeklyReport } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/weekly-report', getWeeklyReport);

export default router;

