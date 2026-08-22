import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const timeRange = (req.query.timeRange as string) || '7d';

    // Data variations based on selected time filter (Today, 7D, 30D, 90D)
    let totalProcessed = 4285000;
    let successCount = 1248;
    let failedCount = 62;
    let refundedVolume = 48500;
    let flaggedCount = 9;
    let recoverableVolume = 128000;
    let growthRate = 24.5;

    let volumeChartData = [
      { time: 'Mon', volume: 520000, success: 110, failed: 4 },
      { time: 'Tue', volume: 680000, success: 145, failed: 8 },
      { time: 'Wed', volume: 810000, success: 180, failed: 12 },
      { time: 'Thu', volume: 740000, success: 165, failed: 6 },
      { time: 'Fri', volume: 990000, success: 220, failed: 15 },
      { time: 'Sat', volume: 620000, success: 140, failed: 5 },
      { time: 'Sun', volume: 625000, success: 142, failed: 4 },
    ];

    if (timeRange === 'today') {
      totalProcessed = 645000;
      successCount = 142;
      failedCount = 7;
      refundedVolume = 6500;
      flaggedCount = 2;
      recoverableVolume = 45000;
      growthRate = 18.2;
      volumeChartData = [
        { time: '00:00', volume: 25000, success: 8, failed: 0 },
        { time: '04:00', volume: 15000, success: 4, failed: 0 },
        { time: '08:00', volume: 95000, success: 22, failed: 1 },
        { time: '12:00', volume: 210000, success: 48, failed: 3 },
        { time: '16:00', volume: 180000, success: 38, failed: 2 },
        { time: '20:00', volume: 120000, success: 22, failed: 1 },
      ];
    } else if (timeRange === '30d') {
      totalProcessed = 18450000;
      successCount = 5420;
      failedCount = 240;
      refundedVolume = 195000;
      flaggedCount = 34;
      recoverableVolume = 480000;
      growthRate = 31.4;
      volumeChartData = [
        { time: 'Week 1', volume: 3800000, success: 1120, failed: 52 },
        { time: 'Week 2', volume: 4400000, success: 1290, failed: 61 },
        { time: 'Week 3', volume: 4900000, success: 1450, failed: 68 },
        { time: 'Week 4', volume: 5350000, success: 1560, failed: 59 },
      ];
    } else if (timeRange === '90d') {
      totalProcessed = 54200000;
      successCount = 16180;
      failedCount = 780;
      refundedVolume = 540000;
      flaggedCount = 98;
      recoverableVolume = 1250000;
      growthRate = 42.8;
      volumeChartData = [
        { time: 'Month 1', volume: 16200000, success: 4800, failed: 210 },
        { time: 'Month 2', volume: 18450000, success: 5420, failed: 240 },
        { time: 'Month 3', volume: 19550000, success: 5960, failed: 330 },
      ];
    }

    const totalTxns = successCount + failedCount;
    const successRate = totalTxns > 0 ? Number(((successCount / totalTxns) * 100).toFixed(2)) : 100;
    const failureRate = totalTxns > 0 ? Number(((failedCount / totalTxns) * 100).toFixed(2)) : 0;

    const statusBreakdown = [
      { status: 'Successful', count: successCount, amount: Math.round(totalProcessed * 0.92), color: '#059669' },
      { status: 'Failed', count: failedCount, amount: recoverableVolume, color: '#E11D48' },
      { status: 'Refunded', count: 14, amount: refundedVolume, color: '#2563EB' },
      { status: 'Held', count: 5, amount: 85000, color: '#D97706' },
      { status: 'Flagged', count: flaggedCount, amount: 142000, color: '#DC2626' },
    ];

    const riskBreakdown = [
      { category: 'Low Risk (<25)', count: Math.round(successCount * 0.94), percentage: 94, color: '#059669' },
      { category: 'Medium Risk (25-50)', count: Math.round(successCount * 0.04), percentage: 4, color: '#2563EB' },
      { category: 'High Risk (50-75)', count: 6, percentage: 1.5, color: '#D97706' },
      { category: 'Critical Risk (>75)', count: 3, percentage: 0.5, color: '#DC2626' },
    ];

    const aiInsights = [
      {
        id: 'ins_001',
        title: '3 High-Risk Payments Require Operator Review',
        description: 'Payment pay_MkkX9102bc (₹1,28,000) flagged with risk score 78 due to rapid 3DS velocity bursts from VPN endpoints.',
        type: 'critical',
        actionText: 'Investigate Risk',
        actionRoute: '/risk-center',
      },
      {
        id: 'ins_002',
        title: `₹${recoverableVolume.toLocaleString('en-IN')} in Failed Payments Potentially Recoverable`,
        description: '62 transactions failed due to 3DS authentication timeouts during peak customer checkout windows.',
        type: 'recovery',
        actionText: 'Recover Payments',
        actionRoute: '/recovery',
      },
      {
        id: 'ins_003',
        title: `Payment Volume Up ${growthRate}% Compared to Previous Period`,
        description: 'UPI transaction conversion remains steady at 98.4%, while card authorization drop-offs dropped 4.2%.',
        type: 'growth',
        actionText: 'View Volume Analytics',
        actionRoute: '/payments',
      },
    ];

    const recentPayments = [
      {
        id: 'pay_NzkX9218ab',
        razorpayOrderId: 'order_Oab91823x',
        razorpayPaymentId: 'pay_NzkX9218ab',
        amount: 45000,
        currency: 'INR',
        status: 'captured',
        method: 'card',
        cardBrand: 'Visa',
        cardLast4: '4242',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        riskLevel: 'low',
        riskScore: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'pay_MkkX9102bc',
        razorpayOrderId: 'order_P9102834y',
        razorpayPaymentId: 'pay_MkkX9102bc',
        amount: 128000,
        currency: 'INR',
        status: 'failed',
        failureReason: '3DS Authentication Failed / Cardholder Cancelled',
        method: 'card',
        cardBrand: 'Mastercard',
        cardLast4: '8812',
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@example.com',
        riskLevel: 'high',
        riskScore: 78,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'pay_KkJL7712cd',
        razorpayOrderId: 'order_Q1234567z',
        razorpayPaymentId: 'pay_KkJL7712cd',
        amount: 12500,
        currency: 'INR',
        status: 'captured',
        method: 'upi',
        customerName: 'Rohan Gupta',
        customerEmail: 'rohan.g@example.com',
        riskLevel: 'low',
        riskScore: 4,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'pay_Ref99182ab',
        razorpayOrderId: 'order_R9918273x',
        razorpayPaymentId: 'pay_Ref99182ab',
        amount: 3200,
        currency: 'INR',
        status: 'refunded',
        method: 'netbanking',
        customerName: 'Kavita Sundaram',
        customerEmail: 'kavita.s@example.com',
        riskLevel: 'low',
        riskScore: 12,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    const systemStatus = {
      razorpayConnection: 'connected',
      database: 'connected',
      aiEngine: 'online',
      webhookListener: 'active',
      gatewayMode: 'TEST MODE',
    };

    return sendSuccess(res, {
      timeRange,
      stats: {
        totalProcessed,
        successfulPayments: {
          count: successCount,
          rate: successRate,
        },
        failedPayments: {
          count: failedCount,
          rate: failureRate,
        },
        refundedAmount: {
          amount: refundedVolume,
          count: 14,
        },
        flaggedTransactions: {
          count: flaggedCount,
          avgRiskScore: 14.2,
        },
        recoverableAmount: {
          amount: recoverableVolume,
          count: failedCount,
        },
        growthRate,
      },
      volumeChartData,
      statusBreakdown,
      riskBreakdown,
      recentPayments,
      aiInsights,
      systemStatus,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch dashboard metrics', 500);
  }
}
