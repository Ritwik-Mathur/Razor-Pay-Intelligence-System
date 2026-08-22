import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import { ROUTES } from '../utils/constants';
import { Mail, Lock, User, Building, Phone, Globe, Briefcase, ArrowRight, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessCategory, setBusinessCategory] = useState('E-Commerce & Retail');
  const [country, setCountry] = useState('India');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters.';
    }

    if (!businessName.trim() || businessName.trim().length < 2) {
      errors.businessName = 'Business / Merchant Name is required.';
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid work email address.';
    }

    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedToTerms) {
      errors.agreedToTerms = 'You must agree to the RPAI Terms and Privacy Policy.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
        businessName,
        mobile,
        businessCategory,
        country,
        agreedToTerms,
      });

      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      if (err.errors) {
        // Flatten Zod errors
        const formatted: Record<string, string> = {};
        for (const k in err.errors) {
          formatted[k] = Array.isArray(err.errors[k]) ? err.errors[k][0] : err.errors[k];
        }
        setFieldErrors(formatted);
      }
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4 space-y-4">
      {formError && (
        <Toast
          type="error"
          title="Registration Error"
          message={formError}
          onClose={() => setFormError(null)}
        />
      )}

      <Card className="shadow-2xl border-slate-200 p-8 space-y-6">
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Merchant Onboarding
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create RPAI Merchant Account</h2>
          <p className="text-xs text-slate-500">Register your payment operations portal to start monitoring Razorpay telemetry.</p>
        </div>

        {/* Fast Gmail / Google Registration */}
        <button
          type="button"
          onClick={() => {
            const demoEmail = `merchant.${Math.floor(100 + Math.random() * 900)}@gmail.com`;
            setEmail(demoEmail);
            setFullName('Ritwik Merchant');
            setBusinessName('RPAI Merchant Store');
            setPassword('Password123!');
            setConfirmPassword('Password123!');
            setAgreedToTerms(true);
          }}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Quick Register with Gmail
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">or fill manually</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="e.g. Aarav Sharma"
              error={fieldErrors.fullName}
              required
            />

            <Input
              label="Business / Merchant Name *"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              leftIcon={<Building className="w-4 h-4" />}
              placeholder="e.g. Acme Tech Solutions"
              error={fieldErrors.businessName}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Work Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="aarav@acme.com"
              error={fieldErrors.email}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="+91 98765 43210"
              error={fieldErrors.mobile}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="At least 8 characters"
              error={fieldErrors.password}
              required
            />

            <Input
              label="Confirm Password *"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Repeat password"
              error={fieldErrors.confirmPassword}
              required
            />
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Business Category (Optional)</label>
              <div className="relative">
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="SaaS & Software">SaaS & Software</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Education & EdTech">Education & EdTech</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Country (Optional)</label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="India">India (IN)</option>
                  <option value="United States">United States (US)</option>
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="Singapore">Singapore (SG)</option>
                  <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
              />
              <span>
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} className="font-semibold text-blue-600 hover:underline">RPAI Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-semibold text-blue-600 hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {fieldErrors.agreedToTerms && (
              <p className="text-xs text-rose-600 font-medium mt-1">{fieldErrors.agreedToTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 text-sm mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create RPAI Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-bold text-blue-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </Card>
    </div>
  );
};
