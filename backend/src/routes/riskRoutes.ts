import { Router } from 'express';
import { getRiskAlerts } from '../controllers/riskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/alerts', authMiddleware, getRiskAlerts);
export default router;
