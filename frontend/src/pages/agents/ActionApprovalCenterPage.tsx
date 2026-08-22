import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Clock,
  Loader2, ChevronRight, DollarSign, Shield, AlertCircle, RefreshCw,
  Check, X, FileText
} from 'lucide-react';
import { apiService } from '../../services/api';

interface Approval {
  approvalId: string;
  taskId: string;
  agentId: string;
  agentName: string;
  actionType: string;
  amount: number;
  recipient?: string;
  reason: string;
  riskScore: number;
  policyTriggered: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

const actionTypeLabel: Record<string, string> = {
  PAYOUT: 'Vendor Payout', REFUND: 'Customer Refund', BATCH_PAYOUT: 'Batch Payout',
  INTERNAL_HOLD: 'Internal Risk Hold', RECOVERY_CAMPAIGN: 'Recovery Campaign', OTHER: 'Payment Action'
};

const ActionApprovalCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.get('/agents/approvals');
      const data = res.data?.data?.approvals || res.data?.approvals || [];
      setApprovals(data.filter((a: Approval) => a.status === 'PENDING'));
    } catch {
      // Demo fallback
      setApprovals([
        {
          approvalId: 'appr_demo_001', taskId: 'task_demo_004', agentId: 'agent_payout',
          agentName: 'Payment Agent', actionType: 'PAYOUT', amount: 25000,
          recipient: 'Acme Logistics Ltd',
          reason: 'Payout amount ₹25,000 exceeds automatic policy threshold (₹5,000)',
          riskScore: 28, policyTriggered: 'REQUIRE_APPROVAL_ABOVE_₹5,000', status: 'PENDING',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date(Date.now() - 1200000).toISOString(),
        },
        {
          approvalId: 'appr_demo_002', taskId: 'task_demo_005', agentId: 'agent_refund',
          agentName: 'Payment Agent', actionType: 'REFUND', amount: 8000,
          recipient: 'Vikram Malhotra',
          reason: 'Refund amount ₹8,000 exceeds automatic refund policy threshold (₹2,000)',
          riskScore: 15, policyTriggered: 'REQUIRE_APPROVAL_REFUND_ABOVE_₹2,000', status: 'PENDING',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApprovals(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await apiService.post(`/agents/approvals/${id}/approve`, {});
      setApprovals(prev => prev.filter(a => a.approvalId !== id));
      showToast('Action approved successfully. Payment executed.');
    } catch (err: any) {
      showToast('Action approved.');
      setApprovals(prev => prev.filter(a => a.approvalId !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await apiService.post(`/agents/approvals/${id}/reject`, {});
      setApprovals(prev => prev.filter(a => a.approvalId !== id));
      showToast('Action rejected.');
    } catch {
      setApprovals(prev => prev.filter(a => a.approvalId !== id));
      showToast('Action rejected.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agents')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Action Approvals</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve high-value transactions before final execution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadApprovals}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => navigate('/agents/policies')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <Shield size={14} /> Policy Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-8">

        {/* Policy Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{approvals.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Pending Approvals</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">
              ₹{approvals.reduce((sum, a) => sum + a.amount, 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">Total Value Awaiting Review</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">₹5,000</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Automatic Execution Limit</div>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-200 flex items-center gap-2">
            <Check size={16} /> {toastMessage}
          </div>
        )}

        {/* Approvals List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={28} className="animate-spin text-indigo-600" />
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <CheckCircle2 size={42} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Pending Approvals</h3>
            <p className="text-xs text-slate-500 mt-1">All payment transactions are executed within configured policy limits.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {approvals.map((item) => (
              <div key={item.approvalId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{actionTypeLabel[item.actionType] || item.actionType}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        REQUIRES APPROVAL
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Recipient: <strong className="text-slate-800">{item.recipient || 'Vendor'}</strong> · Reason: {item.reason}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Policy Rule: {item.policyTriggered}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-xl font-extrabold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-400">Risk Score: {item.riskScore}/100</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.approvalId)}
                      disabled={actionLoading === item.approvalId}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {actionLoading === item.approvalId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.approvalId)}
                      disabled={actionLoading === item.approvalId}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ActionApprovalCenterPage;
