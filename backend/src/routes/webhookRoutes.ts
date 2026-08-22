import { Router } from 'express';
import { handleRazorpayWebhook } from '../controllers/webhookController.js';

const router = Router();

// Webhook endpoint (Signature verified inside controller)
router.post('/razorpay', handleRazorpayWebhook);

export default router;
