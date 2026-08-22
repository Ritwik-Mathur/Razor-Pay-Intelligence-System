import mongoose, { Schema, Document } from 'mongoose';

export type RiskLevel = 'LOW' | 'LOW_MODERATE' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
export type RecommendationType =
  | 'PROCEED_TO_LENDER_REVIEW'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'MANUAL_REVIEW_RECOMMENDED'
  | 'HIGH_RISK_FURTHER_ASSESSMENT_REQUIRED';

export interface IScoreComponent {
  name: string;
  weight: number; // Configured weight e.g. 0.28
  rawScore: number; // 0-100
  weightedScore: number; // rawScore * weight * 900
  positiveFactors: string[];
  negativeFactors: string[];
}

export interface ICreditAssessment extends Document {
  assessmentId: string;
  applicationId: string;
  userId: string;

  // Alternative Credit Score 300-900
  alternativeCreditScore: number;
  riskLevel: RiskLevel;
  confidence: number; // 0-100
  dataCompleteness: number; // 0-100

  // Score Components
  components: IScoreComponent[];

  // Factors
  positiveFactors: string[];
  riskFactors: string[];
  missingData: string[];

  // Affordability
  affordabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
  estimatedFreeCashFlow: number;
  estimatedRepaymentCapacity: number;

  // AI Explanation
  aiExplanation: string;

  // Responsible Lending
  responsibleLendingChecks: {
    consentPresent: boolean;
    dataSufficient: boolean;
    affordabilityCalculated: boolean;
    riskConfidenceAcceptable: boolean;
    requiresHumanReview: boolean;
  };

  // Recommendation (NOT a loan approval)
  recommendation: RecommendationType;

  isDemoData: boolean;
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreComponentSchema = new Schema({
  name: String,
  weight: Number,
  rawScore: Number,
  weightedScore: Number,
  positiveFactors: [String],
  negativeFactors: [String],
});

const CreditAssessmentSchema = new Schema<ICreditAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    applicationId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    alternativeCreditScore: { type: Number, required: true, min: 300, max: 900 },
    riskLevel: {
      type: String,
      enum: ['LOW', 'LOW_MODERATE', 'MODERATE', 'HIGH', 'VERY_HIGH'],
      required: true,
    },
    confidence: { type: Number, default: 0 },
    dataCompleteness: { type: Number, default: 0 },

    components: [ScoreComponentSchema],
    positiveFactors: [String],
    riskFactors: [String],
    missingData: [String],

    affordabilityLevel: { type: String, enum: ['HIGH', 'MODERATE', 'LOW'] },
    estimatedFreeCashFlow: { type: Number, default: 0 },
    estimatedRepaymentCapacity: { type: Number, default: 0 },

    aiExplanation: { type: String },

    responsibleLendingChecks: {
      consentPresent: { type: Boolean, default: false },
      dataSufficient: { type: Boolean, default: false },
      affordabilityCalculated: { type: Boolean, default: false },
      riskConfidenceAcceptable: { type: Boolean, default: false },
      requiresHumanReview: { type: Boolean, default: true },
    },

    recommendation: {
      type: String,
      enum: [
        'PROCEED_TO_LENDER_REVIEW',
        'ADDITIONAL_INFORMATION_REQUIRED',
        'MANUAL_REVIEW_RECOMMENDED',
        'HIGH_RISK_FURTHER_ASSESSMENT_REQUIRED',
      ],
    },

    isDemoData: { type: Boolean, default: false },
    calculatedAt: { type: Date },
  },
  { timestamps: true }
);

export const CreditAssessment = mongoose.model<ICreditAssessment>('CreditAssessment', CreditAssessmentSchema);
