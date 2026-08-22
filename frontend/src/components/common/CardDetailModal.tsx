import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusBadge } from '../ui/StatusBadge';
import { RpaiCreditCard } from './RpaiCreditCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShieldCheck, Lock, Activity, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: any | null;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ isOpen, onClose, card }) => {
  const navigate = useNavigate();

  if (!card) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Method Telemetry Inspector"
      subtitle={`Tokenized Razorpay Method ID: ${card.id}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Top Visual Card & Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <RpaiCreditCard
            network={card.network}
            last4={card.last4}
            holderName={card.holderName}
            label={card.label}
            status={card.status}
          />

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Lifetime Spend</span>
              <p className="text-2xl font-black text-slate-900">{formatCurrency(card.totalSpent)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Transactions</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">{card.paymentCount} Orders</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Issuer Bank</span>
                <p className="text-xs font-bold text-slate-800 mt-1 truncate">{card.issuer || 'HDFC Bank'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Last Activity</span>
                <p className="font-bold text-slate-800">{formatDate(card.lastUsedAt)}</p>
              </div>
              <Badge variant={card.riskScore > 70 ? 'danger' : 'success'}>
                Score: {card.riskScore} / 100
              </Badge>
            </div>
          </div>
        </div>

        {/* Security Rule Panel */}
        <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400 font-extrabold uppercase tracking-wider text-[11px]">
            <Lock className="w-4 h-4" /> PCI-DSS & RPAI Security Compliance
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Sensitive card information (Full PAN, CVV, PIN, or Card Passwords) is <strong>never stored</strong> by RPAI. Razorpay Checkout tokenizes all payment details securely.
          </p>
        </div>

        {/* BIN Telemetry */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
            BIN Security & Risk Telemetry
          </h4>
          <p className="text-slate-600 leading-relaxed">{card.riskTelemetry}</p>
        </div>

        {/* Transaction History for this Card */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Recent Payments Using This Method
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {card.recentTransactions && card.recentTransactions.length > 0 ? (
              card.recentTransactions.map((tx: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    navigate(`/payments/${tx.id}`);
                  }}
                  className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-600 hover:underline">{tx.id}</span>
                    <p className="text-[10px] text-slate-400">{formatDate(tx.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">{formatCurrency(tx.amount)}</span>
                    <StatusBadge status={tx.status} />
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-slate-400 text-xs">No recent transactions recorded for this method.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
