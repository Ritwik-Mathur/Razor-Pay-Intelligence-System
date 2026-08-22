import { Router } from 'express';
import {
  runReconciliation,
  getReconciliationRuns,
  getReconciliationRunDetail,
  getReconciliationReport,
} from '../controllers/reconciliationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/report', authMiddleware, getReconciliationReport);
router.get('/runs', authMiddleware, getReconciliationRuns);
router.get('/runs/:batchId', authMiddleware, getReconciliationRunDetail);
router.post('/run', authMiddleware, runReconciliation);

export default router;
