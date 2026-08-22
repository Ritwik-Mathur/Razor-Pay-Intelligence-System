import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getCustomers);
router.get('/:id', authMiddleware, getCustomerById);

export default router;
