import mongoose, { Schema, Document } from 'mongoose';

export type ApplicantType = 'INDIVIDUAL' | 'MSME';
export type ApplicationStatus =
  | 'DRAFT'
  | 'CONSENT_PENDING'
  | 'DATA_COLLECTION'
  | 'ASSESSED'
  | 'REVIEW_REQUIRED'
  | 'COMPLETED';

export interface ICreditApplication extends Document {
  applicationId: string;
  userId: string;
  applicantType: ApplicantType;
  // Personal Details
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  businessCategory?: string;
  businessAgeMonths?: number;
  // Financials
  monthlyRevenue: number;
  monthlyExpenses: number;
  existingMonthlyObligations: number;
  requestedLoanAmount: number;
  preferredTenureMonths: number;
  loanPurpose: string;
  // Optional MSME Fields
  gstNumber?: string;
  panNumber?: string;
  // Assessment
  status: ApplicationStatus;
  assessmentId?: string;
  // Demo
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CreditApplicationSchema = new Schema<ICreditApplication>(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    applicantType: { type: String, enum: ['INDIVIDUAL', 'MSME'], required: true },
    fullName: { type: String, required: true },
    businessName: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    businessCategory: { type: String },
    businessAgeMonths: { type: Number },
    monthlyRevenue: { type: Number, required: true },
    monthlyExpenses: { type: Number, required: true },
    existingMonthlyObligations: { type: Number, default: 0 },
    requestedLoanAmount: { type: Number, required: true },
    preferredTenureMonths: { type: Number, required: true },
    loanPurpose: { type: String, required: true },
    gstNumber: { type: String },
    panNumber: { type: String },
    status: {
      type: String,
      enum: ['DRAFT', 'CONSENT_PENDING', 'DATA_COLLECTION', 'ASSESSED', 'REVIEW_REQUIRED', 'COMPLETED'],
      default: 'DRAFT',
    },
    assessmentId: { type: String },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CreditApplication = mongoose.model<ICreditApplication>('CreditApplication', CreditApplicationSchema);
