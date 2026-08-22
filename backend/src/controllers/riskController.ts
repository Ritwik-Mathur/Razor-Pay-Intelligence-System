import { Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export async function getRiskAlerts(req: any, res: Response) {
  return sendSuccess(res, [
    {
      id: 'risk_alt_01',
      paymentId: 'pay_MkkX9102bc',
      customerEmail: 'priya.patel@example.com',
      amount: 128000,
      riskScore: 78,
      riskLevel: 'high',
      factors: ['Velocity spike: 5 attempts in 3 mins', 'IP Country mismatch (SE Asia VPN node)', 'Unusual transaction value'],
      aiExplanation: 'The user attempted high-value transaction from an anonymized VPN endpoint within 3 minutes of account creation.',
      recommendedAction: 'Require 2FA re-verification or step-up authentication before retrying.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]);
}
