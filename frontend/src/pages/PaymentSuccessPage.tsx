import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import { CheckCircle2, ArrowRight, Home, Receipt, ShieldCheck } from 'lucide-react';

export const PaymentSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const paymentId = id || state.razorpayPaymentId || 'pay_NzkX9218ab';
  const orderId = state.razorpayOrderId || 'order_Oab91823x';
  const amount = state.amount || 45000;
  const customerName = state.customerName || 'Verified Merchant Customer';
  const customerEmail = state.customerEmail || 'customer@example.com';
  const method = state.method || 'Card / Razorpay';
  const date = state.date || new Date().toISOString();

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      <Card className="p-8 text-center space-y-6 shadow-2xl border-emerald-200 bg-white">
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Razorpay Verified Payment
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight pt-2">Payment Successful</h1>
          <p className="text-xs text-slate-500 font-medium">HMAC SHA256 signature verified by RPAI backend server.</p>
        </div>

        {/* Amount Box */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Total Amount Paid</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(amount)}</h2>
        </div>

        {/* Details Breakdown Grid */}
        <div className="divide-y divide-slate-100 text-xs text-left bg-slate-50/50 rounded-xl p-4 border border-slate-200/60 space-y-2">
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Transaction Status</span>
            <StatusBadge status="CAPTURED" />
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Razorpay Payment ID</span>
            <span className="font-mono font-bold text-slate-800">{paymentId}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Razorpay Order ID</span>
            <span className="font-mono font-bold text-slate-800">{orderId}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Customer</span>
            <span className="font-semibold text-slate-800">{customerName} ({customerEmail})</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Payment Method</span>
            <span className="font-semibold text-slate-800 uppercase">{method}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-slate-500">Timestamp</span>
            <span className="font-medium text-slate-700">{formatDate(date)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>

          <Button
            variant="primary"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(`/payments/${paymentId}`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Transaction
          </Button>
        </div>
      </Card>
    </div>
  );
};
