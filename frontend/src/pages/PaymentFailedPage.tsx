import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import { XCircle, RefreshCcw, ArrowRight, ShieldAlert, RotateCcw } from 'lucide-react';

export const PaymentFailedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const orderId = id || state.orderId || 'order_P9102834y';
  const paymentId = state.paymentId || 'pay_MkkX9102bc';
  const reason = state.reason || '3DS Verification Timeout or Cardholder Dismissed';
  const amount = state.amount || 128000;

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      <Card className="p-8 text-center space-y-6 shadow-2xl border-rose-200 bg-white">
        {/* Failed Circle */}
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-rose-50">
          <XCircle className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Payment Processing Failed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight pt-2">Payment Failed</h1>
          <p className="text-xs text-slate-500 font-medium">Order ID: {orderId}</p>
        </div>

        {/* Reason Box */}
        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1 text-left">
          <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">
            Failure Diagnostics
          </span>
          <p className="text-xs text-rose-900 font-bold">{reason}</p>
          <p className="text-[11px] text-rose-700">RPAI Recovery Agent has automatically recorded this payment drop-off.</p>
        </div>

        {/* Breakdown */}
        <div className="divide-y divide-slate-100 text-xs text-left bg-slate-50/50 rounded-xl p-4 border border-slate-200/60 space-y-2">
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Attempted Amount</span>
            <span className="font-bold text-slate-900">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Transaction Status</span>
            <StatusBadge status="FAILED" />
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Razorpay Payment ID</span>
            <span className="font-mono font-bold text-slate-800">{paymentId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/payments/create')}
            leftIcon={<RefreshCcw className="w-4 h-4" />}
          >
            Try Payment Again
          </Button>

          <Button
            variant="primary"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(ROUTES.RECOVERY)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Launch Recovery Nudge
          </Button>
        </div>
      </Card>
    </div>
  );
};
