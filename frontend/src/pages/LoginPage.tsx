import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import { ROUTES } from '../utils/constants';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, LockKeyhole } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('operations@merchant.com');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password, rememberMe);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 space-y-4">
      {errorMessage && (
        <Toast
          type="error"
          title="Authentication Failed"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      <Card className="shadow-2xl border-slate-200 p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Merchant Portal Sign In</h2>
          <p className="text-xs text-slate-500">Access your RPAI payment command center & telemetry dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Merchant Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="operations@merchant.com"
            required
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-semibold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
              />
              Remember me on this browser
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 text-sm mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Security Section Required by Prompt */}
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800">
          <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs uppercase tracking-wider">
            <LockKeyhole className="w-4 h-4" /> RPAI Secure Access
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Your payment and account information is protected with AES-256 encryption, TLS 1.3, and isolated Razorpay Test Mode API keys.
          </p>
          <div className="pt-1 flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-bit SSL
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-400" /> Tokenized Vault
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-bold text-blue-600 hover:underline">
            Create RPAI Account
          </Link>
        </div>
      </Card>
    </div>
  );
};
