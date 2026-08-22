import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import riskRoutes from './riskRoutes.js';
import recoveryRoutes from './recoveryRoutes.js';
import reconciliationRoutes from './reconciliationRoutes.js';
import aiRoutes from './aiRoutes.js';
import auditRoutes from './auditRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import customerRoutes from './customerRoutes.js';
import actionRoutes from './actionRoutes.js';
import creditRoutes from './creditRoutes.js';
import agentRoutes from './agentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/payments', paymentRoutes);
router.use('/customers', customerRoutes);
router.use('/risk', riskRoutes);
router.use('/recovery', recoveryRoutes);
router.use('/reconciliation', reconciliationRoutes);
router.use('/ai', aiRoutes);
router.use('/audit', auditRoutes);
router.use('/notifications', notificationRoutes);
router.use('/actions', actionRoutes);
router.use('/credit', creditRoutes);
router.use('/agents', agentRoutes);

export default router;
