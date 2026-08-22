import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  businessName: string;
  mobile?: string;
  businessCategory?: string;
  country?: string;
  merchantId: string;
  role: 'admin' | 'analyst' | 'operator';
  testMode: boolean;
  twoFactorEnabled: boolean;
  avatarInitials?: string;
  status: 'active' | 'suspended' | 'pending';
  agreedToTerms: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    status: 'success' | 'failed';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    mobile: { type: String, trim: true },
    businessCategory: { type: String, trim: true },
    country: { type: String, default: 'India' },
    merchantId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'analyst', 'operator'], default: 'admin' },
    testMode: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
    agreedToTerms: { type: Boolean, required: true, default: false },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    loginHistory: [
      {
        ip: { type: String },
        userAgent: { type: String },
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['success', 'failed'], default: 'success' },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
