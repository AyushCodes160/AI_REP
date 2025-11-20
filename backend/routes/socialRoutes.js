import express from 'express';
import {
  connectAccount,
  getAccounts,
  disconnectAccount,
} from '../controllers/socialController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/connect', connectAccount);
router.get('/accounts', getAccounts);
router.delete('/accounts/:platform', disconnectAccount);

export default router;

