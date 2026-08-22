export interface User {
  id: string;
  email: string;
  fullName: string;
  businessName: string;
  mobile?: string;
  businessCategory?: string;
  country?: string;
  merchantId: string;
  role: 'admin' | 'analyst' | 'operator';
  testMode: boolean;
  twoFactorEnabled?: boolean;
  status: 'active' | 'suspended' | 'pending';
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
}

export interface LoginSession {
  ip: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'payment_received' | 'payment_failed' | 'risk_detected' | 'refund_completed' | 'ai_complete' | 'system' | 'recovery';
  severity: 'info' | 'success' | 'warning' | 'critical';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  cardBrand?: string;
  cardLast4?: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  failureReason?: string;
  createdAt: string;
  aiRiskSummary?: string;
  auditHistory?: { timestamp: string; action: string; actor: string }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  totalTransactions: number;
  status: 'active' | 'flagged' | 'blocked';
  createdAt: string;
}

export interface RiskAlert {
  id: string;
  paymentId: string;
  customerEmail: string;
  amount: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  aiExplanation: string;
  recommendedAction: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface RecoveryCase {
  id: string;
  paymentId: string;
  customerEmail: string;
  amount: number;
  failureReason: string;
  recoveryStatus: 'pending' | 'link_sent' | 'recovered' | 'abandoned';
  recoveryStrategy: string;
  attemptsCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  category: 'auth' | 'payment' | 'risk' | 'recovery' | 'system' | 'settings';
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface DashboardStats {
  totalVolume: number;
  successfulTransactions: number;
  failedTransactions: number;
  conversionRate: number;
  riskScoreAvg: number;
  flaggedTransactions: number;
  recoveredVolume: number;
  recoverySuccessRate: number;
  monthlyVolumeGrowth: number;
  recentPayments: Payment[];
}
