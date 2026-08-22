import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Lock, ShieldCheck, Download, Trash2, Info, CheckCircle2, XCircle, Sliders } from 'lucide-react';

export const ConsentPrivacyPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sources, setSources] = useState([
    { id: '1', name: 'Razorpay Payment Activity', status: 'CONNECTED', allowed: true, purpose: 'Payment consistency & volume analysis', lastAccessed: 'Today' },
    { id: '2', name: 'Business Information', status: 'CONNECTED', allowed: true, purpose: 'Operating history & category validation', lastAccessed: 'Today' },
    { id: '3', name: 'Financial Behavior Questionnaire', status: 'CONNECTED', allowed: true, purpose: 'Self-reported financial planning assessment', lastAccessed: 'Yesterday' },
    { id: '4', name: 'Bank Account Cash-Flow Data', status: 'DEMO DATA', allowed: false, purpose: 'Monthly inflow/outflow stability calculation', lastAccessed: 'Never' },
    { id: '5', name: 'Merchant & Customer Ratings', status: 'DEMO DATA', allowed: true, purpose: 'Refund ratio & reputation scoring', lastAccessed: '3 days ago' },
    { id: '6', name: 'Mobile Bill Consistency', status: 'NOT CONNECTED', allowed: false, purpose: 'Payment consistency indicator', lastAccessed: 'Never' },
    { id: '7', name: 'Coarse Location Stability', status: 'UNAVAILABLE', allowed: false, purpose: 'Aggregated location stability metric', lastAccessed: 'Never' },
  ]);

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, allowed: !s.allowed } : s))
    );
    setToastMessage('Consent preferences updated successfully.');
  };

  const handleRevokeAll = () => {
    setSources((prev) => prev.map((s) => ({ ...s, allowed: false })));
    setToastMessage('All data source consents have been revoked.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toastMessage && (
        <Toast type="info" title="Privacy Action" message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Data, Your Choice</h1>
          </div>
          <p className="text-xs text-slate-500">Manage consent, privacy permissions, and data retention for alternative credit signals.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setToastMessage('Data export initiated.')} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download Data
          </Button>
          <Button variant="danger" size="sm" onClick={handleRevokeAll} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
            Revoke All Consents
          </Button>
        </div>
      </div>

      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Privacy-First Data Guarantee:</span>
          <span>
            RPAI never accesses alternative data sources without your explicit consent. Revoking consent immediately stops data access and purges derived feature vectors from upcoming assessments.
          </span>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Alternative Data Sources & Consents</h3>
          <span className="text-[10px] font-bold text-slate-400">Version 1.0</span>
        </div>

        <div className="divide-y divide-slate-100">
          {sources.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{s.name}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      s.status === 'CONNECTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'DEMO DATA'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{s.purpose}</p>
                <span className="text-[10px] text-slate-400 block font-mono">Last Accessed: {s.lastAccessed}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  size="sm"
                  variant={s.allowed ? 'outline' : 'primary'}
                  onClick={() => toggleSource(s.id)}
                  className={s.allowed ? 'text-rose-600 hover:bg-rose-50 border-rose-200' : ''}
                >
                  {s.allowed ? 'Revoke Access' : 'Enable Access'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
