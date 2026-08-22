import { Router } from 'express';
import {
  getPayments,
  getPaymentById,
  createOrder,
  verifyPayment,
  recordFailedPayment,
  getPaymentMethods,
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getPayments);
router.get('/methods', authMiddleware, getPaymentMethods);
router.get('/:id', authMiddleware, getPaymentById);
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.post('/fail', authMiddleware, recordFailedPayment);

export default router;
