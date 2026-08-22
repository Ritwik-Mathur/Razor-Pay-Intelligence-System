import { Router } from 'express';
import {
  getRecoverySummary,
  getRecoveryCases,
  getRecoveryTimeline,
  initiateRecovery,
} from '../controllers/recoveryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/summary', authMiddleware, getRecoverySummary);
router.get('/cases', authMiddleware, getRecoveryCases);
router.get('/cases/:id/timeline', authMiddleware, getRecoveryTimeline);
router.post('/initiate', authMiddleware, initiateRecovery);

export default router;
