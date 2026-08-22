import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import axios from 'axios';
import {
  Scale,
  RefreshCw,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Clock,
  TrendingUp,
  IndianRupee,
  Info,
  Search,
  Filter,
  Download,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type ReconciliationResult = 'MATCHED' | 'MISMATCH' | 'MISSING_INTERNAL' | 'MISSING_RAZORPAY';

interface ReconciliationItem {
  paymentId: string;
  razorpayOrderId?: string;
  customerName?: string;
  customerEmail?: string;
  internalAmount: number;
  razorpayAmount: number;
  internalStatus: string;
  razorpayStatus: string;
  refundInternal: number;
  refundRazorpay: number;
  result: ReconciliationResult;
  difference: number;
  aiExplanation?: string;
}

interface ReconciliationRunData {
  batchId: string;
  runBy?: string;
  totalTransactions: number;
  matched: number;
  mismatched: number;
  missingInternal: number;
  missingRazorpay: number;
  unresolved: number;
  totalDifference: number;
  items?: ReconciliationItem[];
  status: string;
  completedAt?: string;
  createdAt?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return `₹${Math.abs(n).toLocaleString('en-IN')}`;
}

function formatRelative(dateStr?: string): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

const RESULT_CONFIG: Record<
  ReconciliationResult,
  { label: string; bg: string; text: string; border: string; dot: string; icon: React.ReactNode }
> = {
  MATCHED: {
    label: 'Matched',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  },
  MISMATCH: {
    label: 'Mismatch',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
  },
  MISSING_INTERNAL: {
    label: 'Missing in RPAI',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    icon: <XCircle className="w-4 h-4 text-amber-500" />,
  },
  MISSING_RAZORPAY: {
    label: 'Missing on Razorpay',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    icon: <XCircle className="w-4 h-4 text-orange-500" />,
  },
};

// ─── Comparison Row ───────────────────────────────────────────────────────────
const ComparisonBlock: React.FC<{
  label: string;
  internalAmount: number;
  razorpayAmount: number;
  internalStatus: string;
  razorpayStatus: string;
  result: ReconciliationResult;
  difference: number;
}> = ({ internalAmount, razorpayAmount, internalStatus, razorpayStatus, result, difference }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 min-w-0">
    {/* Internal */}
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center min-w-0 overflow-hidden">
      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 truncate">RPAI Internal</p>
      <p className="text-base font-extrabold text-slate-900 truncate">{formatCurrency(internalAmount)}</p>
      <span className="text-[10px] font-semibold uppercase text-slate-500 mt-0.5 block truncate">{internalStatus}</span>
    </div>

    {/* vs. arrow */}
    <div className="flex flex-col items-center justify-center gap-1 py-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${RESULT_CONFIG[result].bg} border ${RESULT_CONFIG[result].border} shrink-0`}>
        {RESULT_CONFIG[result].icon}
      </div>
      <span className={`text-[10px] font-bold uppercase ${RESULT_CONFIG[result].text} truncate`}>
        {RESULT_CONFIG[result].label}
      </span>
      {difference !== 0 && (
        <span className="text-[10px] font-bold text-rose-600 truncate">
          Δ {formatCurrency(difference)}
        </span>
      )}
    </div>

    {/* Razorpay */}
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center min-w-0 overflow-hidden">
      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 truncate">Razorpay</p>
      <p className="text-base font-extrabold text-slate-900 truncate">
        {razorpayAmount === 0 && result === 'MISSING_RAZORPAY' ? '—' : formatCurrency(razorpayAmount)}
      </p>
      <span className="text-[10px] font-semibold uppercase text-slate-500 mt-0.5 block truncate">{razorpayStatus}</span>
    </div>
  </div>
);

// ─── Item Card ────────────────────────────────────────────────────────────────
const ReconciliationItemCard: React.FC<{
  item: ReconciliationItem;
  expanded: boolean;
  onToggle: () => void;
}> = ({ item, expanded, onToggle }) => {
  const cfg = RESULT_CONFIG[item.result];

  return (
    <div className={`border rounded-xl overflow-hidden ${item.result !== 'MATCHED' ? `border-l-4 ${cfg.border}` : 'border-slate-200'}`}>
      {/* Header Row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors text-left"
        onClick={onToggle}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-[11px] font-mono font-bold text-slate-700">{item.paymentId}</code>
            {item.customerName && (
              <span className="text-[11px] text-slate-500">{item.customerName}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs font-extrabold text-slate-800">{formatCurrency(item.internalAmount)}</span>
            {item.difference !== 0 && (
              <span className="text-[11px] font-bold text-rose-600">
                Δ {item.difference > 0 ? '+' : '-'}{formatCurrency(item.difference)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-4">
          {/* Comparison Block */}
          <ComparisonBlock
            label={item.paymentId}
            internalAmount={item.internalAmount}
            razorpayAmount={item.razorpayAmount}
            internalStatus={item.internalStatus}
            razorpayStatus={item.razorpayStatus}
            result={item.result}
            difference={item.difference}
          />

          {/* Refund Row if relevant */}
          {(item.refundInternal > 0 || item.refundRazorpay > 0) && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-center">
                <p className="text-[10px] font-bold uppercase text-rose-400 mb-0.5">Refund — RPAI</p>
                <p className="font-extrabold text-rose-700">{formatCurrency(item.refundInternal)}</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-center">
                <p className="text-[10px] font-bold uppercase text-rose-400 mb-0.5">Refund — Razorpay</p>
                <p className="font-extrabold text-rose-700">{formatCurrency(item.refundRazorpay)}</p>
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {item.aiExplanation && (
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[10px] font-bold uppercase text-sky-600">AI Explanation</span>
              </div>
              <p className="text-xs text-sky-900 leading-relaxed">{item.aiExplanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ReconciliationPage: React.FC = () => {
  const [runs, setRuns] = useState<ReconciliationRunData[]>([]);
  const [activeRun, setActiveRun] = useState<ReconciliationRunData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [resultFilter, setResultFilter] = useState<'all' | ReconciliationResult>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const token = () => localStorage.getItem('rpai_token') || '';
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  // Fetch run history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/reconciliation/runs', { headers: headers() });
      const data = res.data?.data || [];
      setRuns(Array.isArray(data) ? data : [data]);
    } catch {
      // silently fail — seeded data shown by backend
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRunReconciliation = async () => {
    setIsRunning(true);
    setActiveRun(null);
    setExpandedItems(new Set());
    try {
      const res = await axios.post('/api/reconciliation/run', {}, { headers: headers() });
      const run = res.data?.data as ReconciliationRunData;
      setActiveRun(run);
      // Prepend to history
      setRuns((prev) => [run, ...prev.filter((r) => r.batchId !== run.batchId)]);
    } catch (err: any) {
      alert('Reconciliation run failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const toggleItem = (paymentId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(paymentId) ? next.delete(paymentId) : next.add(paymentId);
      return next;
    });
  };

  const expandAll = () => {
    if (!activeRun?.items) return;
    setExpandedItems(new Set(activeRun.items.map((i) => i.paymentId)));
  };

  const collapseAll = () => setExpandedItems(new Set());

  // Filter items
  const filteredItems = (activeRun?.items || []).filter((item) => {
    const matchResult = resultFilter === 'all' || item.result === resultFilter;
    const matchSearch =
      !searchQuery ||
      item.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchResult && matchSearch;
  });

  const displayRun = activeRun || (runs.length > 0 ? runs[0] : null);

  const STAT_CARDS = displayRun
    ? [
        {
          label: 'Total Transactions',
          value: displayRun.totalTransactions,
          display: String(displayRun.totalTransactions),
          icon: <FileCheck2 className="w-5 h-5 text-slate-500" />,
          bg: 'bg-slate-50 border-slate-200',
          text: 'text-slate-800',
        },
        {
          label: 'Matched',
          value: displayRun.matched,
          display: String(displayRun.matched),
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
        },
        {
          label: 'Mismatched',
          value: displayRun.mismatched,
          display: String(displayRun.mismatched),
          icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
          bg: 'bg-rose-50 border-rose-200',
          text: 'text-rose-700',
        },
        {
          label: 'Unresolved',
          value: displayRun.unresolved,
          display: String(displayRun.unresolved),
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-700',
        },
        {
          label: 'Total Difference',
          value: displayRun.totalDifference,
          display: formatCurrency(displayRun.totalDifference),
          icon: <IndianRupee className="w-5 h-5 text-indigo-500" />,
          bg: displayRun.totalDifference === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-indigo-50 border-indigo-200',
          text: displayRun.totalDifference === 0 ? 'text-emerald-700' : 'text-indigo-700',
        },
      ]
    : [];

  const FILTER_TABS = [
    { key: 'all', label: 'All', count: activeRun?.items?.length || 0 },
    { key: 'MATCHED', label: 'Matched', count: activeRun?.items?.filter((i) => i.result === 'MATCHED').length || 0 },
    { key: 'MISMATCH', label: 'Mismatch', count: activeRun?.items?.filter((i) => i.result === 'MISMATCH').length || 0 },
    { key: 'MISSING_INTERNAL', label: 'Missing in RPAI', count: activeRun?.items?.filter((i) => i.result === 'MISSING_INTERNAL').length || 0 },
    { key: 'MISSING_RAZORPAY', label: 'Missing on Razorpay', count: activeRun?.items?.filter((i) => i.result === 'MISSING_RAZORPAY').length || 0 },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reconciliation Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            3-way matching between RPAI internal records, Razorpay payment state, and refund data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={fetchHistory}
            isLoading={loadingHistory}
          >
            Refresh History
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={isRunning ? undefined : <Play className="w-4 h-4" />}
            onClick={handleRunReconciliation}
            isLoading={isRunning}
          >
            {isRunning ? 'Running Reconciliation...' : 'Run Reconciliation'}
          </Button>
        </div>
      </div>

      {/* Running animation */}
      {isRunning && (
        <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-700">Reconciliation in progress...</p>
            <p className="text-xs text-indigo-500">Fetching Razorpay payment states and comparing against internal records.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {STAT_CARDS.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAT_CARDS.map((sc) => (
            <div key={sc.label} className={`p-3.5 rounded-xl border ${sc.bg}`}>
              <div className="flex items-center justify-between mb-1.5">{sc.icon}</div>
              <p className={`text-xl font-extrabold ${sc.text}`}>{sc.display}</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{sc.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Run Detail */}
      {activeRun && (
        <div className="space-y-4">
          {/* Run Meta Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-3">
              <code className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                {activeRun.batchId}
              </code>
              <span className="text-[11px] text-slate-400">
                Completed {formatRelative(activeRun.completedAt)}
              </span>
              {activeRun.totalDifference === 0 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Clean Match
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                  <AlertTriangle className="w-3.5 h-3.5" /> {activeRun.unresolved} Issues Found
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2"
              >
                Expand All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={collapseAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Filter + Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search payment ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {FILTER_TABS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setResultFilter(f.key as any)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    resultFilter === f.key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f.label}
                  {f.count > 0 && <span className="ml-1 opacity-60">({f.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-400">No items match the selected filter.</div>
            ) : (
              filteredItems.map((item) => (
                <ReconciliationItemCard
                  key={item.paymentId}
                  item={item}
                  expanded={expandedItems.has(item.paymentId)}
                  onToggle={() => toggleItem(item.paymentId)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* No active run state */}
      {!activeRun && !isRunning && (
        <Card className="py-12 text-center">
          <Scale className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-600 mb-1">No active reconciliation run</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            Click <strong>Run Reconciliation</strong> to compare RPAI internal records against live Razorpay payment data.
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-4 h-4" />}
            onClick={handleRunReconciliation}
          >
            Run Reconciliation Now
          </Button>
        </Card>
      )}

      {/* Previous Runs History */}
      {runs.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Previous Reconciliation Runs</span>
            <span className="text-xs text-slate-400">{runs.length} runs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-100">
                <tr>
                  {['Batch ID', 'Date', 'Transactions', 'Matched', 'Unresolved', 'Total Difference', 'Status'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {runs.map((run) => (
                  <tr key={run.batchId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <code className="font-mono text-[11px] font-bold text-slate-700">{run.batchId}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatRelative(run.completedAt || run.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{run.totalTransactions}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {run.matched}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {run.unresolved > 0 ? (
                        <span className="flex items-center gap-1 font-bold text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" /> {run.unresolved}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-extrabold ${
                          run.totalDifference === 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {run.totalDifference === 0 ? '₹0 — Clean' : formatCurrency(run.totalDifference)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {run.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
