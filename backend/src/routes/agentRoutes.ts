import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listAgents,
  getAgent,
  createAgentTask,
  listAgentTasks,
  getAgentTask,
  cancelAgentTask,
  getPendingApprovals,
  approveAction,
  rejectAction,
  getAgentActivity,
  getAgentPerformance,
  getAgentPolicies,
  updateAgentPolicies,
  pauseAllAgents,
  resumeAllAgents,
  executeCommand,
} from '../controllers/agentsController.js';

const router = Router();

// Require authentication for all agent operations
router.use(authMiddleware);

// Catalog & Overview
router.get('/', listAgents);
router.get('/performance', getAgentPerformance);
router.get('/activity', getAgentActivity);
router.post('/command', executeCommand);

// Kill Switch
router.post('/pause-all', pauseAllAgents);
router.post('/resume-all', resumeAllAgents);

// Tasks
router.post('/tasks', createAgentTask);
router.get('/tasks', listAgentTasks);
router.get('/tasks/:id', getAgentTask);
router.post('/tasks/:id/cancel', cancelAgentTask);

// Action Approval Center
router.get('/approvals', getPendingApprovals);
router.post('/approvals/:id/approve', approveAction);
router.post('/approvals/:id/reject', rejectAction);

// Policies & Settings
router.get('/policies', getAgentPolicies);
router.put('/policies/:id', updateAgentPolicies);

// Single Agent Detail
router.get('/:id', getAgent);

export default router;
