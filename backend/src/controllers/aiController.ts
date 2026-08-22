import { Request, Response } from 'express';
import { executeAiQuery } from '../agents/index.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function askAi(req: Request, res: Response) {
  try {
    const { question, query, paymentId } = req.body;
    const promptText = question || query || (paymentId ? `Investigate payment ${paymentId}` : 'Summarize platform telemetry');

    const result = await executeAiQuery(promptText);

    return sendSuccess(res, result, 'AI response generated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'AI processing failed', 500);
  }
}
