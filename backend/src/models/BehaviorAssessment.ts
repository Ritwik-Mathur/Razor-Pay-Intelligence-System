import mongoose, { Schema, Document } from 'mongoose';

export interface IBehaviorAssessment extends Document {
  assessmentId: string;
  applicationId: string;
  userId: string;

  // Financial Behavior & Risk Questionnaire responses
  // Scores 0-100 per dimension (derived from questionnaire answers)
  financialPlanningScore: number;
  repaymentDisciplineScore: number;
  emergencyPreparednessScore: number;
  incomeStabilityScore: number;
  businessContinuityScore: number;
  riskAwarenessScore: number;
  financialDecisionConsistencyScore: number;

  // Composite behavioral score 0-100
  overallBehaviorScore: number;

  // Questionnaire metadata
  questionsAnswered: number;
  totalQuestions: number;
  completionRate: number;

  // Raw questionnaire answers (stored securely, not sent to LLM)
  questionnaireAnswers: Array<{
    questionId: string;
    answer: number; // 1-5 scale
  }>;

  isDemoData: boolean;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BehaviorAssessmentSchema = new Schema<IBehaviorAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    applicationId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    financialPlanningScore: { type: Number, default: 0 },
    repaymentDisciplineScore: { type: Number, default: 0 },
    emergencyPreparednessScore: { type: Number, default: 0 },
    incomeStabilityScore: { type: Number, default: 0 },
    businessContinuityScore: { type: Number, default: 0 },
    riskAwarenessScore: { type: Number, default: 0 },
    financialDecisionConsistencyScore: { type: Number, default: 0 },

    overallBehaviorScore: { type: Number, default: 0 },

    questionsAnswered: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 14 },
    completionRate: { type: Number, default: 0 },

    questionnaireAnswers: [
      {
        questionId: String,
        answer: { type: Number, min: 1, max: 5 },
      },
    ],

    isDemoData: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const BehaviorAssessment = mongoose.model<IBehaviorAssessment>(
  'BehaviorAssessment',
  BehaviorAssessmentSchema
);
