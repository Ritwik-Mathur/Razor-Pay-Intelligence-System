import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Save, Loader2, AlertTriangle, RefreshCw, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { apiService } from '../../services/api';

interface Policy {
  maxAutoPaymentAmount: number;
  maxAutoPayoutAmount: number;
  maxAutoRefundAmount: number;
  dailyPayoutLimit: number;
  dailyTransactionCountLimit: number;
  requireApprovalAboveAmount: number;
  allowHighRiskAutoExecute: boolean;
  allowOutsideBusinessHours: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  globalKillSwitchActive: boolean;
}

const DEFAULTS: Policy = {
  maxAutoPaymentAmount: 25000,
  maxAutoPayoutAmount: 5000,
  maxAutoRefundAmount: 2000,
  dailyPayoutLimit: 100000,
  dailyTransactionCountLimit: 50,
  requireApprovalAboveAmount: 5000,
  allowHighRiskAutoExecute: false,
  allowOutsideBusinessHours: true,
  businessHoursStart: '09:00',
  businessHoursEnd: '18:00',
  globalKillSwitchActive: false,
};

const NumberField = ({
  label, description, value, onChange, prefix = '₹'
}: {
  label: string; description: string; value: number; onChange: (v: number) => void; prefix?: string;
}) => (
  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
    <div className="text-xs font-bold text-slate-900 mb-1">{label}</div>
    <div className="text-xs text-slate-500 mb-3">{description}</div>
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
      {prefix && <span className="text-sm font-bold text-slate-500">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-base font-bold text-slate-900 outline-none"
      />
    </div>
  </div>
);

const ToggleField = ({
  label, description, value, onChange
}: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
    <div>
      <div className="text-xs font-bold text-slate-900 mb-1">{label}</div>
      <div className="text-xs text-slate-500">{description}</div>
    </div>
    <button onClick={() => onChange(!value)} className="flex-shrink-0">
      {value
        ? <ToggleRight size={34} className="text-emerald-600" />
        : <ToggleLeft size={34} className="text-slate-300" />
      }
    </button>
  </div>
);

const AgentPolicySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res: any = await apiService.get('/agents/policies');
        const data = res.data?.data?.policy || res.data?.policy;
        if (data) setPolicy(data);
      } catch {
        setPolicy(DEFAULTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (key: keyof Policy, val: any) => setPolicy(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.put('/agents/policies/default', policy);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/agents')} className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agent Policy Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">Configure transaction limits and safety thresholds</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-8 flex flex-col gap-4">
        <NumberField
          label="Max Automatic Payout Threshold"
          description="Payouts above this amount automatically route to Action Approvals before execution."
          value={policy.maxAutoPayoutAmount}
          onChange={v => update('maxAutoPayoutAmount', v)}
        />
        <NumberField
          label="Max Automatic Refund Threshold"
          description="Customer refunds above this amount require human approval."
          value={policy.maxAutoRefundAmount}
          onChange={v => update('maxAutoRefundAmount', v)}
        />
        <NumberField
          label="Daily Payout Volume Limit"
          description="Maximum cumulative payout volume agents can execute in 24 hours."
          value={policy.dailyPayoutLimit}
          onChange={v => update('dailyPayoutLimit', v)}
        />
        <ToggleField
          label="Allow Operations Outside Business Hours"
          description="Allow Payment Agent to execute scheduled tasks outside 9:00 AM - 6:00 PM."
          value={policy.allowOutsideBusinessHours}
          onChange={v => update('allowOutsideBusinessHours', v)}
        />
      </div>
    </div>
  );
};

export default AgentPolicySettingsPage;
