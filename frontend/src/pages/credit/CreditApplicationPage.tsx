import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';
import {
  FileText,
  User,
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Info,
  DollarSign,
  Calendar,
} from 'lucide-react';

export const CreditApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [applicantType, setApplicantType] = useState<'INDIVIDUAL' | 'MSME'>('MSME');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessCategory, setBusinessCategory] = useState('E-Commerce & Digital Services');
  const [businessAgeMonths, setBusinessAgeMonths] = useState('24');
  const [monthlyRevenue, setMonthlyRevenue] = useState('95000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('52000');
  const [existingMonthlyObligations, setExistingMonthlyObligations] = useState('6000');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState('300000');
  const [preferredTenureMonths, setPreferredTenureMonths] = useState('18');
  const [loanPurpose, setLoanPurpose] = useState('Working Capital & Inventory Purchase');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  // Consents
  const [consents, setConsents] = useState<Record<string, boolean>>({
    RAZORPAY_PAYMENT_ACTIVITY: true,
    BANK_CASH_FLOW: true,
    MOBILE_BILL_PAYMENT: false,
    ECOMMERCE_BEHAVIOR: false,
    GEOLOCATION_STABILITY: false,
    MERCHANT_RATINGS: true,
    BEHAVIOR_QUESTIONNAIRE: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleConsent = (key: string) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all required personal details.');
      return;
    }

    if (applicantType === 'MSME' && !businessName.trim()) {
      setErrorMessage('Business Name is required for MSME applicants.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('rpai_token');
      const payload = {
        applicantType,
        fullName,
        businessName: applicantType === 'MSME' ? businessName : undefined,
        email,
        phone,
        businessCategory,
        businessAgeMonths: Number(businessAgeMonths) || 0,
        monthlyRevenue: Number(monthlyRevenue) || 0,
        monthlyExpenses: Number(monthlyExpenses) || 0,
        existingMonthlyObligations: Number(existingMonthlyObligations) || 0,
        requestedLoanAmount: Number(requestedLoanAmount) || 0,
        preferredTenureMonths: Number(preferredTenureMonths) || 12,
        loanPurpose,
        gstNumber: gstNumber || undefined,
        panNumber: panNumber || undefined,
      };

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/credit/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Application failed');

      const appId = json.data?.applicationId || 'app_new';

      // Grant consented sources
      for (const [source, granted] of Object.entries(consents)) {
        if (granted) {
          await fetch(`${API_BASE}/credit/consent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ applicationId: appId, dataSource: source, purpose: 'Alternative credit assessment' }),
          }).catch(() => {});
        }
      }

      // Trigger calculation
      await fetch(`${API_BASE}/credit/profile/${appId}/calculate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});

      navigate(`/credit/profile/${appId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit credit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {errorMessage && (
        <Toast type="error" title="Submission Error" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Alternative Credit Assessment</h1>
          <p className="text-xs text-slate-500">Consent-based financial analysis for individuals and MSMEs.</p>
        </div>
        <span className="text-xs font-bold text-slate-400">Step 1 of 2</span>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          RPAI provides AI-assisted financial risk assessment insights. It does NOT guarantee loan approval or disburse funds directly.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Applicant Type */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">1. Applicant Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setApplicantType('MSME')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                applicantType === 'MSME'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Building2 className={`w-6 h-6 ${applicantType === 'MSME' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs">MSME / Small Business</span>
            </button>

            <button
              type="button"
              onClick={() => setApplicantType('INDIVIDUAL')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                applicantType === 'INDIVIDUAL'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <User className={`w-6 h-6 ${applicantType === 'INDIVIDUAL' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs">Individual / Freelancer</span>
            </button>
          </div>
        </Card>

        {/* Section 2: Personal & Business Info */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">2. Contact & Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Mehta"
              required
            />
            {applicantType === 'MSME' && (
              <Input
                label="Business / Registered Name *"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Mehta Digital Solutions"
                required
              />
            )}
            <Input
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              required
            />
            <Input
              label="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
            <Input
              label="Business Category"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              placeholder="e.g. E-Commerce"
            />
            <Input
              label="Operating History (Months)"
              type="number"
              value={businessAgeMonths}
              onChange={(e) => setBusinessAgeMonths(e.target.value)}
              placeholder="24"
            />
          </div>
        </Card>

        {/* Section 3: Declared Financials */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">3. Financial Declarations & Loan Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Monthly Revenue (₹) *"
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              placeholder="95000"
              required
            />
            <Input
              label="Monthly Expenses (₹) *"
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder="52000"
              required
            />
            <Input
              label="Existing Obligations (₹)"
              type="number"
              value={existingMonthlyObligations}
              onChange={(e) => setExistingMonthlyObligations(e.target.value)}
              placeholder="6000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Input
              label="Requested Loan Amount (₹) *"
              type="number"
              value={requestedLoanAmount}
              onChange={(e) => setRequestedLoanAmount(e.target.value)}
              placeholder="300000"
              required
            />
            <Input
              label="Preferred Tenure (Months) *"
              type="number"
              value={preferredTenureMonths}
              onChange={(e) => setPreferredTenureMonths(e.target.value)}
              placeholder="18"
              required
            />
            <Input
              label="Loan Purpose *"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              placeholder="e.g. Working Capital"
              required
            />
          </div>
        </Card>

        {/* Section 4: Consent-First Alternative Data Selection */}
        <Card className="p-6 space-y-4 border-sky-200 bg-sky-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">4. Your Data, Your Choice (Consent Selection)</h3>
            </div>
            <span className="text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              Privacy First
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Select which alternative data signals RPAI may analyze for your assessment. Never accessed without explicit consent.
          </p>

          <div className="space-y-2.5 pt-1">
            {[
              { key: 'RAZORPAY_PAYMENT_ACTIVITY', label: 'Razorpay Payment Activity', desc: 'Analyzes payment success rates, transaction frequency, and volume.' },
              { key: 'BANK_CASH_FLOW', label: 'Bank Account Cash-Flow Data', desc: 'Calculates monthly inflow/outflow stability and free cash flow.' },
              { key: 'MERCHANT_RATINGS', label: 'Merchant / Customer Ratings', desc: 'Evaluates refund ratios and transaction consistency.' },
              { key: 'BEHAVIOR_QUESTIONNAIRE', label: 'Financial Behavior Questionnaire', desc: 'Self-reported planning and repayment discipline assessment.' },
              { key: 'MOBILE_BILL_PAYMENT', label: 'Mobile Bill Consistency', desc: 'Payment consistency indicator (optional).' },
              { key: 'GEOLOCATION_STABILITY', label: 'Coarse Location Stability', desc: 'Aggregated location consistency metrics.' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                onClick={() => toggleConsent(key)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  consents[key] ? 'bg-white border-blue-500 shadow-2xs' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {consents[key] ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">{label}</span>
                  <span className="text-[11px] text-slate-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          className="w-full justify-center py-3 font-extrabold"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Generate Alternative Assessment
        </Button>
      </form>
    </div>
  );
};
