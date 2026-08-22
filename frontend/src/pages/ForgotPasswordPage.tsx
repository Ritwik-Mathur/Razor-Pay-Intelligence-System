import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../utils/constants';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full shadow-xl border-slate-200 p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Account Password</h2>
        <p className="text-xs text-slate-500">We will send password reset instructions to your registered email.</p>
      </div>

      {isSubmitted ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-bold text-emerald-900">Reset Email Dispatched</h4>
          <p className="text-xs text-emerald-700">Check <span className="font-semibold">{email}</span> for your reset token link.</p>
          <Link to={ROUTES.LOGIN} className="inline-block pt-2 text-xs font-bold text-blue-600 hover:underline">
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Merchant Registered Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="operations@merchant.com"
            required
          />

          <Button type="submit" variant="primary" className="w-full">
            Send Reset Instructions
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
};
