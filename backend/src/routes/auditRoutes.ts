import { Router } from 'express';
import { getAuditLogs, getSecurityStatus, getTransactionTimeline } from '../controllers/auditController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authMiddleware, getAuditLogs);
router.get('/security-status', authMiddleware, getSecurityStatus);
router.get('/timeline/:paymentId', authMiddleware, getTransactionTimeline);
export default router;
