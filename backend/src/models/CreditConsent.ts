import mongoose, { Schema, Document } from 'mongoose';

export type DataSource =
  | 'RAZORPAY_PAYMENT_ACTIVITY'
  | 'BANK_CASH_FLOW'
  | 'MOBILE_BILL_PAYMENT'
  | 'ECOMMERCE_BEHAVIOR'
  | 'GEOLOCATION_STABILITY'
  | 'MERCHANT_RATINGS'
  | 'BEHAVIOR_QUESTIONNAIRE'
  | 'BUSINESS_INFORMATION';

export type ConsentStatus = 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'PENDING';

export interface ICreditConsent extends Document {
  consentId: string;
  userId: string;
  applicationId: string;
  dataSource: DataSource;
  consentStatus: ConsentStatus;
  purpose: string;
  grantedAt?: Date;
  revokedAt?: Date;
  expiresAt?: Date;
  version: string;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const CreditConsentSchema = new Schema<ICreditConsent>(
  {
    consentId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    applicationId: { type: String, required: true, index: true },
    dataSource: {
      type: String,
      enum: [
        'RAZORPAY_PAYMENT_ACTIVITY',
        'BANK_CASH_FLOW',
        'MOBILE_BILL_PAYMENT',
        'ECOMMERCE_BEHAVIOR',
        'GEOLOCATION_STABILITY',
        'MERCHANT_RATINGS',
        'BEHAVIOR_QUESTIONNAIRE',
        'BUSINESS_INFORMATION',
      ],
      required: true,
    },
    consentStatus: {
      type: String,
      enum: ['GRANTED', 'REVOKED', 'EXPIRED', 'PENDING'],
      default: 'PENDING',
    },
    purpose: { type: String, required: true },
    grantedAt: { type: Date },
    revokedAt: { type: Date },
    expiresAt: { type: Date },
    version: { type: String, default: '1.0' },
    ipAddress: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

export const CreditConsent = mongoose.model<ICreditConsent>('CreditConsent', CreditConsentSchema);
