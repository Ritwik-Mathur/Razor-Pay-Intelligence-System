import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskAnalysis extends Document {
  merchantId: string;
  paymentId: string;
  riskScore: number;
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  aiExplanation: string;
  recommendedAction: string;
  potentialImpact?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const RiskAnalysisSchema: Schema = new Schema(
  {
    merchantId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, unique: true, index: true },
    riskScore: { type: Number, required: true },
    riskCategory: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    factors: [{ type: String }],
    aiExplanation: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    potentialImpact: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const RiskAnalysis = mongoose.model<IRiskAnalysis>('RiskAnalysis', RiskAnalysisSchema);
