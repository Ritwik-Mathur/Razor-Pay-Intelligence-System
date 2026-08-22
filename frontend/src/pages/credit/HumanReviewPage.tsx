import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Toast } from '../../components/ui/Toast';
import { UserCheck, CheckCircle2, AlertTriangle, XCircle, FileText, Info } from 'lucide-react';

export const HumanReviewPage: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const reviewItems = [
    {
      id: 'demo_app_003',
      applicant: 'Rajesh Kumar (Street Vendor)',
      score: 418,
      riskLevel: 'HIGH',
      reason: 'Low net cash flow margin and operating history < 6 months.',
      requestedAmount: 80000,
      monthlyInflow: 18000,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toast && <Toast type="info" title="Workflow Action" message={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Human Review Queue</h1>
          </div>
          <p className="text-xs text-slate-500">Manual review workflow for high-risk credit assessments.</p>
        </div>
      </div>

      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Actions taken here update assessment status in the review workflow. They do NOT disburse funds directly unless integrated with a licensed lender portal.
        </span>
      </div>

      <div className="space-y-4">
        {reviewItems.map((item) => (
          <Card key={item.id} className="p-6 space-y-4 border-amber-200 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  Requires Human Review
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">{item.applicant}</h3>
                <p className="text-xs text-slate-500">Requested: ₹{item.requestedAmount.toLocaleString('en-IN')}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-rose-500">{item.score}</span>
                <span className="text-[10px] text-slate-400 block font-mono">/ 900</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Flagged Reason:</strong> {item.reason}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setToast('Assessment approved for further lender review.')}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Approve for Further Review
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setToast('Request sent to applicant for additional information.')}
              >
                Request More Information
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setToast('Assessment flagged as rejected.')}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject Assessment
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
