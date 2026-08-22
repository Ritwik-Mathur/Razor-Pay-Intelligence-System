import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { Transaction } from '../models/Transaction.js';
import { AuditLog } from '../models/AuditLog.js';
import { ReconciliationRun, IReconciliationItem, ReconciliationResult } from '../models/ReconciliationRun.js';
import { fetchRazorpayPayment } from '../razorpay/index.js';
import { logger } from '../utils/logger.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// ─── AI Explanation Generator (grounded, no hallucination) ───────────────────
function generateAiExplanation(item: IReconciliationItem): string {
  switch (item.result) {
    case 'MATCHED':
      return `Internal record and Razorpay both show ₹${item.internalAmount.toLocaleString('en-IN')} for payment ${item.paymentId}. Statuses align (${item.internalStatus} / ${item.razorpayStatus}). No action required.`;
    case 'MISMATCH':
      if (item.internalAmount === 0 && item.razorpayAmount > 0) {
        return `Razorpay captured ₹${item.razorpayAmount.toLocaleString('en-IN')} for ${item.paymentId}, but RPAI has ₹0. Likely cause: Razorpay webhook was not received or processed. Check webhook delivery logs and re-sync this payment.`;
      }
      if (item.razorpayAmount === 0 && item.internalAmount > 0) {
        return `RPAI recorded ₹${item.internalAmount.toLocaleString('en-IN')} for ${item.paymentId}, but Razorpay shows ₹0. Likely cause: Order was created but payment was never captured. This may be a pending/expired order.`;
      }
      return `Amount discrepancy for ${item.paymentId}: RPAI internal ₹${item.internalAmount.toLocaleString('en-IN')} vs Razorpay ₹${item.razorpayAmount.toLocaleString('en-IN')} (difference ₹${Math.abs(item.difference).toLocaleString('en-IN')}). Possible causes: partial refund not synced, test-mode override, or webhook race condition. Recommend manual review.`;
    case 'MISSING_INTERNAL':
      return `Payment ${item.paymentId} exists on Razorpay (₹${item.razorpayAmount.toLocaleString('en-IN')}, status: ${item.razorpayStatus}) but has no matching record in RPAI database. Possible cause: webhook received but DB write failed. Recommend creating an internal record manually.`;
    case 'MISSING_RAZORPAY':
      return `RPAI has a record for ${item.paymentId} (₹${item.internalAmount.toLocaleString('en-IN')}), but Razorpay returned no data for this payment ID. Possible causes: test-mode payment that was never confirmed, or the payment ID is malformed. Recommend verifying the Razorpay Dashboard directly.`;
    default:
      return 'Reconciliation status could not be determined. Manual investigation required.';
  }
}

// ─── Seed items for demo / empty DB ─────────────────────────────────────────
function buildSeedItems(): IReconciliationItem[] {
  return [
    {
      paymentId: 'pay_Cc8821xy',
      razorpayOrderId: 'order_Bc8821xy',
      customerName: 'Vikram Nair',
      customerEmail: 'vikram.nair@example.com',
      internalAmount: 89000,
      razorpayAmount: 89000,
      internalStatus: 'CAPTURED',
      razorpayStatus: 'captured',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MATCHED',
      difference: 0,
    },
    {
      paymentId: 'pay_Ab7710ef',
      razorpayOrderId: 'order_Ab7710ef',
      customerName: 'Ananya Mehta',
      customerEmail: 'ananya.mehta@example.com',
      internalAmount: 120000,
      razorpayAmount: 120000,
      internalStatus: 'FAILED',
      razorpayStatus: 'failed',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MATCHED',
      difference: 0,
    },
    {
      paymentId: 'pay_XcY8831oq',
      razorpayOrderId: 'order_XcY8831oq',
      customerName: 'Deepak Rao',
      customerEmail: 'deepak.rao@example.com',
      internalAmount: 45000,
      razorpayAmount: 45000,
      internalStatus: 'REFUNDED',
      razorpayStatus: 'refunded',
      refundInternal: 45000,
      refundRazorpay: 45000,
      result: 'MATCHED',
      difference: 0,
    },
    {
      paymentId: 'pay_MkkX9102bc',
      razorpayOrderId: 'order_MkkX9102bc',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.com',
      internalAmount: 0,
      razorpayAmount: 128000,
      internalStatus: 'HELD',
      razorpayStatus: 'authorized',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MISMATCH',
      difference: 128000,
    },
    {
      paymentId: 'pay_Yq8831zz',
      razorpayOrderId: 'order_Yq8831zz',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      internalAmount: 67000,
      razorpayAmount: 0,
      internalStatus: 'FAILED',
      razorpayStatus: 'not_found',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MISMATCH',
      difference: -67000,
    },
    {
      paymentId: 'pay_Zk2291ab',
      razorpayOrderId: 'order_Zk2291ab',
      customerName: 'Kavita Singh',
      customerEmail: 'kavita.singh@example.com',
      internalAmount: 69000,
      razorpayAmount: 69000,
      internalStatus: 'CAPTURED',
      razorpayStatus: 'captured',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MATCHED',
      difference: 0,
    },
    {
      paymentId: 'pay_ghost_001',
      razorpayOrderId: 'order_ghost_001',
      customerName: 'Unknown',
      customerEmail: 'unknown@razorpay.com',
      internalAmount: 0,
      razorpayAmount: 34000,
      internalStatus: 'NOT_FOUND',
      razorpayStatus: 'captured',
      refundInternal: 0,
      refundRazorpay: 0,
      result: 'MISSING_INTERNAL',
      difference: 34000,
    },
  ].map((item) => ({
    ...item,
    aiExplanation: generateAiExplanation(item as IReconciliationItem),
  })) as IReconciliationItem[];
}

// ─── Controller: Run Reconciliation ─────────────────────────────────────────
export async function runReconciliation(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'mch_rpai_live_8910';
    const userEmail = req.user?.email || 'system@rpai.in';

    const batchId = `REC_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Date.now().toString(36).toUpperCase()}`;

    logger.info(`Reconciliation run started: ${batchId}`);

    // Pull all internal RPAI transactions for this merchant
    const internalTxns = await Transaction.find({ merchantId }).lean();

    let items: IReconciliationItem[];

    if (internalTxns.length === 0) {
      // No DB data — use seeded demo items
      items = buildSeedItems();
    } else {
      // For each internal transaction, attempt to fetch from Razorpay
      items = await Promise.all(
        internalTxns.map(async (txn): Promise<IReconciliationItem> => {
          const rzpPayment = txn.razorpayPaymentId
            ? await fetchRazorpayPayment(txn.razorpayPaymentId)
            : null;

          const internalAmount = txn.amount;
          const razorpayAmount = rzpPayment
            ? Math.round((rzpPayment.amount as number) / 100)
            : 0;

          const internalStatus = txn.status;
          const razorpayStatus = rzpPayment
            ? String(rzpPayment.status)
            : txn.razorpayPaymentId
            ? 'not_found'
            : 'no_payment_id';

          let result: ReconciliationResult;
          if (!rzpPayment && txn.razorpayPaymentId) {
            result = 'MISSING_RAZORPAY';
          } else if (internalAmount === razorpayAmount) {
            result = 'MATCHED';
          } else {
            result = 'MISMATCH';
          }

          const item: IReconciliationItem = {
            paymentId: txn.razorpayPaymentId || txn.transactionId,
            razorpayOrderId: txn.razorpayOrderId,
            customerName: txn.customerName,
            customerEmail: txn.customerEmail,
            internalAmount,
            razorpayAmount,
            internalStatus,
            razorpayStatus,
            refundInternal: 0,
            refundRazorpay: 0,
            result,
            difference: razorpayAmount - internalAmount,
          };

          item.aiExplanation = generateAiExplanation(item);
          return item;
        })
      );
    }

    // Aggregate totals
    const matched       = items.filter((i) => i.result === 'MATCHED').length;
    const mismatched    = items.filter((i) => i.result === 'MISMATCH').length;
    const missingInt    = items.filter((i) => i.result === 'MISSING_INTERNAL').length;
    const missingRzp    = items.filter((i) => i.result === 'MISSING_RAZORPAY').length;
    const unresolved    = mismatched + missingInt + missingRzp;
    const totalDiff     = items.reduce((sum, i) => sum + Math.abs(i.difference), 0);

    // Persist run
    const run = await ReconciliationRun.create({
      merchantId,
      batchId,
      runBy: userEmail,
      actorType: 'HUMAN',
      dateRange: { from: new Date(Date.now() - 86400000), to: new Date() },
      totalTransactions: items.length,
      matched,
      mismatched,
      missingInternal: missingInt,
      missingRazorpay: missingRzp,
      unresolved,
      totalDifference: totalDiff,
      items,
      status: 'completed',
      completedAt: new Date(),
    });

    // Audit log
    await AuditLog.create({
      merchantId,
      actorType: 'HUMAN',
      actor: userEmail,
      action: 'RUN_RECONCILIATION',
      category: 'system',
      details: `Batch ${batchId}: ${items.length} transactions checked. ${matched} matched, ${mismatched} mismatched, ${unresolved} unresolved. Total difference: ₹${totalDiff.toLocaleString('en-IN')}.`,
      reason: 'Merchant-initiated reconciliation',
      result: 'SUCCESS',
      ipAddress: req.socket?.remoteAddress || '127.0.0.1',
    });

    logger.info(`Reconciliation complete: ${batchId} — ${matched} matched, ${unresolved} unresolved`);

    return sendSuccess(
      res,
      {
        batchId,
        totalTransactions: items.length,
        matched,
        mismatched,
        missingInternal: missingInt,
        missingRazorpay: missingRzp,
        unresolved,
        totalDifference: totalDiff,
        items,
        completedAt: run.completedAt,
      },
      `Reconciliation batch ${batchId} completed: ${matched}/${items.length} matched.`
    );
  } catch (error: any) {
    logger.error('Reconciliation run failed:', error);
    return sendError(res, 'Reconciliation run failed', 500);
  }
}

// ─── Controller: Get Previous Runs ──────────────────────────────────────────
export async function getReconciliationRuns(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'mch_rpai_live_8910';

    const runs = await ReconciliationRun.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-items') // exclude item arrays for list view — too large
      .lean();

    // Seed if no runs yet
    const result = runs.length > 0 ? runs : [
      {
        _id: 'run_seed_001',
        batchId: 'REC_20260821_SEED01',
        runBy: 'system@rpai.in',
        actorType: 'SYSTEM',
        totalTransactions: 7,
        matched: 4,
        mismatched: 2,
        missingInternal: 1,
        missingRazorpay: 0,
        unresolved: 3,
        totalDifference: 229000,
        status: 'completed',
        completedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, 'Failed to retrieve reconciliation history', 500);
  }
}

// ─── Controller: Get Run Detail (includes items) ─────────────────────────────
export async function getReconciliationRunDetail(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'mch_rpai_live_8910';
    const { batchId } = req.params;

    const run = await ReconciliationRun.findOne({ merchantId, batchId }).lean();
    if (!run) return sendError(res, 'Reconciliation run not found', 404);

    return sendSuccess(res, run);
  } catch (error: any) {
    return sendError(res, 'Failed to retrieve run details', 500);
  }
}

// ─── Legacy: getReconciliationReport (kept for backward compat) ──────────────
export async function getReconciliationReport(req: AuthRequest, res: Response) {
  return getReconciliationRuns(req, res);
}
