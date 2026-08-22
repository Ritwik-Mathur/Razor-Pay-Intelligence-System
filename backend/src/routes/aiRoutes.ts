import { Router } from 'express';
import { askAi } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/query', authMiddleware, askAi);
export default router;
