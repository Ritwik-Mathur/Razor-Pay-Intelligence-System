import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createApplication,
  listApplications,
  getApplication,
  calculateProfile,
  getAssessment,
  getCashFlow,
  getAffordability,
  getBehavior,
  submitBehaviorQuestionnaire,
  getQuestionnaire,
  grantConsent,
  getConsents,
  revokeConsent,
  runSimulator,
  askCreditAi,
  getCreditOverview,
} from '../controllers/creditController.js';

const router = Router();

// All credit routes require authentication
router.use(authMiddleware);

// ─── Overview ─────────────────────────────────────────────────────────────────
router.get('/overview', getCreditOverview);

// ─── Applications ─────────────────────────────────────────────────────────────
router.post('/applications', createApplication);
router.get('/applications', listApplications);
router.get('/applications/:id', getApplication);

// ─── Profile & Scoring ────────────────────────────────────────────────────────
router.post('/profile/:id/calculate', calculateProfile);
router.get('/risk/:id', getAssessment);
router.get('/cash-flow/:id', getCashFlow);
router.get('/affordability/:id', getAffordability);

// ─── Behavior Assessment ──────────────────────────────────────────────────────
router.get('/questionnaire', getQuestionnaire);
router.get('/behavior/:id', getBehavior);
router.post('/behavior/:id', submitBehaviorQuestionnaire);

// ─── Consent ──────────────────────────────────────────────────────────────────
router.post('/consent', grantConsent);
router.get('/consent/:applicationId', getConsents);
router.patch('/consent/:id/revoke', revokeConsent);

// ─── Simulator ────────────────────────────────────────────────────────────────
router.post('/simulator', runSimulator);

// ─── AI Credit Advisor ────────────────────────────────────────────────────────
router.post('/ai', askCreditAi);

export default router;
