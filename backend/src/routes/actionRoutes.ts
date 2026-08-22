import { Router } from 'express';
import {
  holdPayment,
  releasePayment,
  refundPayment,
  createRecoveryAttempt,
  createPaymentLink,
  runReconciliation,
} from '../controllers/actionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/hold', authMiddleware, holdPayment);
router.post('/release', authMiddleware, releasePayment);
router.post('/refund', authMiddleware, refundPayment);
router.post('/recovery', authMiddleware, createRecoveryAttempt);
router.post('/create-link', authMiddleware, createPaymentLink);
router.post('/reconcile', authMiddleware, runReconciliation);

export default router;
