import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditProfile extends Document {
  profileId: string;
  applicationId: string;
  userId: string;

  // Cash-Flow Features (Derived, not raw)
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  netMonthlyCashFlow: number;
  cashFlowVolatility: number; // 0-100, lower = more stable
  cashFlowStabilityScore: number; // 0-100
  incomeConsistencyScore: number; // 0-100
  monthlyInflows: number[]; // Last 6 months
  monthlyOutflows: number[]; // Last 6 months

  // Payment Behavior (Derived from Razorpay if consented)
  transactionFrequency: number; // Per month avg
  successfulPaymentRatio: number; // 0-1
  failedPaymentRatio: number; // 0-1
  avgTransactionValue: number;
  medianTransactionValue: number;
  refundRatio: number; // 0-1
  paymentConsistencyScore: number; // 0-100

  // Business Activity
  merchantReputationScore: number; // 0-100
  businessStabilityScore: number; // 0-100

  // Data Completeness
  dataCompleteness: number; // 0-100
  availableSources: string[];
  missingSources: string[];

  // Timestamps
  calculatedAt: Date;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CreditProfileSchema = new Schema<ICreditProfile>(
  {
    profileId: { type: String, required: true, unique: true, index: true },
    applicationId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    avgMonthlyInflow: { type: Number, default: 0 },
    avgMonthlyOutflow: { type: Number, default: 0 },
    netMonthlyCashFlow: { type: Number, default: 0 },
    cashFlowVolatility: { type: Number, default: 0 },
    cashFlowStabilityScore: { type: Number, default: 0 },
    incomeConsistencyScore: { type: Number, default: 0 },
    monthlyInflows: [{ type: Number }],
    monthlyOutflows: [{ type: Number }],

    transactionFrequency: { type: Number, default: 0 },
    successfulPaymentRatio: { type: Number, default: 0 },
    failedPaymentRatio: { type: Number, default: 0 },
    avgTransactionValue: { type: Number, default: 0 },
    medianTransactionValue: { type: Number, default: 0 },
    refundRatio: { type: Number, default: 0 },
    paymentConsistencyScore: { type: Number, default: 0 },

    merchantReputationScore: { type: Number, default: 0 },
    businessStabilityScore: { type: Number, default: 0 },

    dataCompleteness: { type: Number, default: 0 },
    availableSources: [{ type: String }],
    missingSources: [{ type: String }],

    calculatedAt: { type: Date },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CreditProfile = mongoose.model<ICreditProfile>('CreditProfile', CreditProfileSchema);
