import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import {
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  RefreshCw,
  Link2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export type ActionType =
  | 'hold'
  | 'release'
  | 'refund'
  | 'recovery'
  | 'create-link'
  | 'reconcile';

interface ActionConfig {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  confirmLabel: string;
  confirmVariant: 'danger' | 'success' | 'primary';
  warningText: string;
  impactLevel: 'critical' | 'moderate' | 'low';
}

const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  hold: {
    title: 'Place Payment Under Internal Review',
    subtitle: 'This action sets an internal RPAI hold status for review.',
    icon: <PauseCircle className="w-6 h-6 text-amber-600" />,
    confirmLabel: 'Confirm Hold',
    confirmVariant: 'danger',
    warningText:
      'This will flag the transaction as HELD within RPAI for manual review. The Razorpay gateway capture is not directly affected.',
    impactLevel: 'moderate',
  },
  release: {
    title: 'Release Payment from Internal Hold',
    subtitle: 'Restore the payment to CAPTURED status after review.',
    icon: <PlayCircle className="w-6 h-6 text-emerald-600" />,
    confirmLabel: 'Confirm Release',
    confirmVariant: 'success',
    warningText:
      'This will clear the internal hold and restore the payment to active CAPTURED status. Ensure merchant review is complete before releasing.',
    impactLevel: 'moderate',
  },
  refund: {
    title: 'Initiate Razorpay Refund',
    subtitle: 'This will call the Razorpay Refund API to process a real refund.',
    icon: <RotateCcw className="w-6 h-6 text-rose-600" />,
    confirmLabel: 'Confirm Refund',
    confirmVariant: 'danger',
    warningText:
      "A refund will be initiated through Razorpay Test Mode API. This is irreversible once submitted. The customer's payment method will be credited.",
    impactLevel: 'critical',
  },
  recovery: {
    title: 'Create Recovery Attempt',
    subtitle: 'Generate a new Razorpay order linked to the original failed transaction.',
    icon: <RefreshCw className="w-6 h-6 text-sky-600" />,
    confirmLabel: 'Confirm Recovery',
    confirmVariant: 'primary',
    warningText:
      'A new Razorpay Order will be created linked to the original failed payment. This is a legitimate retry, not a simulation.',
    impactLevel: 'low',
  },
  'create-link': {
    title: 'Generate Smart Payment Link',
    subtitle: 'Create a recovery payment link to share with the customer.',
    icon: <Link2 className="w-6 h-6 text-indigo-600" />,
    confirmLabel: 'Generate Link',
    confirmVariant: 'primary',
    warningText:
      'A secure payment recovery link will be generated. Share this with the customer to retry their failed payment.',
    impactLevel: 'low',
  },
  reconcile: {
    title: 'Run Bank Reconciliation',
    subtitle: 'Trigger the reconciliation engine to sync all transactions with Razorpay.',
    icon: <FileCheck2 className="w-6 h-6 text-slate-600" />,
    confirmLabel: 'Run Reconciliation',
    confirmVariant: 'primary',
    warningText:
      'This will verify all RPAI transactions against the Razorpay bank statement and generate a reconciliation report.',
    impactLevel: 'low',
  },
};

const IMPACT_BADGE: Record<string, string> = {
  critical: 'bg-rose-50 text-rose-700 border border-rose-200',
  moderate: 'bg-amber-50 text-amber-700 border border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  transactionId?: string;
  amount?: number;
  onConfirm: (reason: string) => Promise<void>;
}

export const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  isOpen,
  onClose,
  actionType,
  transactionId,
  amount,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const config = ACTION_CONFIGS[actionType];

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(reason || 'Merchant confirmed action');
      setResult({ success: true, message: 'Action completed successfully.' });
    } catch (err: any) {
      setResult({ success: false, message: err?.message || 'Action failed. Please try again.' });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title} subtitle={config.subtitle}>
      {result ? (
        /* Result State */
        <div className="space-y-4 text-center py-2">
          {result.success ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          ) : (
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          )}
          <p className={`text-sm font-semibold ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
            {result.message}
          </p>
          {result.success && (
            <p className="text-xs text-slate-500">
              This action has been recorded in the RPAI Audit Trail.
            </p>
          )}
          <Button variant={result.success ? 'success' : 'outline'} onClick={handleClose} className="mt-2">
            {result.success ? 'Done' : 'Close'}
          </Button>
        </div>
      ) : (
        /* Confirmation State */
        <div className="space-y-5">
          {/* Icon + Impact */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              {config.icon}
            </div>
            <div className="flex-1 space-y-1">
              {transactionId && (
                <p className="text-xs text-slate-500">
                  Transaction:{' '}
                  <span className="font-mono font-bold text-slate-800">{transactionId}</span>
                </p>
              )}
              {amount && (
                <p className="text-xs text-slate-500">
                  Amount:{' '}
                  <span className="font-bold text-slate-800">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </p>
              )}
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded-full mt-1',
                  IMPACT_BADGE[config.impactLevel]
                )}
              >
                {config.impactLevel} impact
              </span>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="flex gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">{config.warningText}</p>
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Reason for Action <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer confirmed identity via 2FA verification..."
              rows={3}
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Safety Note */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>This action requires your explicit confirmation and will be logged in the Audit Trail.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={handleClose} className="flex-1" size="md">
              Cancel
            </Button>
            <Button
              variant={config.confirmVariant}
              onClick={handleConfirm}
              isLoading={isConfirming}
              className="flex-1"
              size="md"
            >
              {config.confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
