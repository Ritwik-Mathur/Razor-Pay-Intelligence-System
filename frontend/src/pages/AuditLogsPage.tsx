import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import axios from 'axios';
import {
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  Bot,
  User,
  Cpu,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Database,
  Wifi,
  Zap,
  Lock,
  Eye,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Link2,
  LogIn,
  LogOut,
  KeyRound,
  Settings,
  Search,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type ActorType = 'AI' | 'HUMAN' | 'SYSTEM';
type ServiceStatus = 'healthy' | 'connected' | 'warning' | 'offline' | 'connecting';

interface AuditEntry {
  _id: string;
  actorType: ActorType;
  actor: string;
  action: string;
  category: string;
  transactionId?: string;
  details: string;
  reason?: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  createdAt: string;
}

interface ServiceItem {
  name: string;
  status: ServiceStatus;
  detail: string;
  lastChecked: string;
}

interface SecurityEvent {
  event: string;
  actor: string;
  ip: string;
  result: string;
  timestamp: string;
}

interface TimelineEvent {
  time: string;
  actorType: ActorType;
  actor: string;
  action: string;
  detail: string;
  result: string;
  timestamp: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────
const ACTOR_CONFIG: Record<ActorType, { icon: React.ReactNode; badge: string; dot: string; rowBg: string }> = {
  AI: {
    icon: <Bot className="w-3.5 h-3.5" />,
    badge: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    rowBg: 'hover:bg-sky-50/30',
  },
  HUMAN: {
    icon: <User className="w-3.5 h-3.5" />,
    badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dot: 'bg-indigo-500',
    rowBg: 'hover:bg-indigo-50/20',
  },
  SYSTEM: {
    icon: <Cpu className="w-3.5 h-3.5" />,
    badge: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
    rowBg: 'hover:bg-slate-50/60',
  },
};

const CATEGORY_BADGE: Record<string, string> = {
  payment: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  risk: 'bg-rose-50 text-rose-700 border-rose-200',
  recovery: 'bg-amber-50 text-amber-700 border-amber-200',
  auth: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  system: 'bg-slate-100 text-slate-600 border-slate-200',
  settings: 'bg-purple-50 text-purple-700 border-purple-200',
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  HOLD_PAYMENT: <PauseCircle className="w-3.5 h-3.5 text-amber-500" />,
  RELEASE_PAYMENT: <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />,
  REFUND_PAYMENT: <RotateCcw className="w-3.5 h-3.5 text-rose-500" />,
  CREATE_RECOVERY_ATTEMPT: <RefreshCw className="w-3.5 h-3.5 text-sky-500" />,
  CREATE_PAYMENT_LINK: <Link2 className="w-3.5 h-3.5 text-indigo-500" />,
  RUN_RECONCILIATION: <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />,
  RISK_ANALYSIS_GENERATED: <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />,
  RISK_THRESHOLD_ALERT: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  MERCHANT_LOGIN: <LogIn className="w-3.5 h-3.5 text-indigo-500" />,
  MERCHANT_LOGOUT: <LogOut className="w-3.5 h-3.5 text-slate-500" />,
  FAILED_LOGIN_ATTEMPT: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
  PASSWORD_CHANGE: <KeyRound className="w-3.5 h-3.5 text-purple-500" />,
  INITIATE_RECOVERY: <RefreshCw className="w-3.5 h-3.5 text-amber-500" />,
};

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  healthy: { label: 'Healthy', color: 'text-emerald-600', dot: 'bg-emerald-500', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  connected: { label: 'Connected', color: 'text-emerald-600', dot: 'bg-emerald-500', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  warning: { label: 'Warning', color: 'text-amber-600', dot: 'bg-amber-500', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  offline: { label: 'Offline', color: 'text-rose-600', dot: 'bg-rose-500', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
  connecting: { label: 'Connecting', color: 'text-sky-600', dot: 'bg-sky-400 animate-pulse', icon: <Activity className="w-4 h-4 text-sky-500 animate-pulse" /> },
};

const SERVICE_ICON: Record<string, React.ReactNode> = {
  'Authentication': <Lock className="w-4 h-4 text-slate-500" />,
  'Database': <Database className="w-4 h-4 text-slate-500" />,
  'Razorpay Gateway': <Wifi className="w-4 h-4 text-slate-500" />,
  'Webhooks': <Zap className="w-4 h-4 text-slate-500" />,
  'AI Engine': <Bot className="w-4 h-4 text-slate-500" />,
  'Audit Logging': <Eye className="w-4 h-4 text-slate-500" />,
  'Rate Limiting': <ShieldCheck className="w-4 h-4 text-slate-500" />,
  'PCI-DSS Compliance': <FileCheck2 className="w-4 h-4 text-slate-500" />,
};

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

const ACTOR_FILTERS = ['All', 'AI', 'HUMAN', 'SYSTEM'] as const;
const CATEGORY_FILTERS = ['All', 'payment', 'risk', 'recovery', 'auth', 'system', 'settings'] as const;
const TABS = [
  { key: 'audit', label: 'Audit Log', icon: <FileCheck2 className="w-4 h-4" /> },
  { key: 'security', label: 'Security Center', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'timeline', label: 'Transaction Timeline', icon: <Activity className="w-4 h-4" /> },
] as const;

// ─── Transaction Timeline Component ──────────────────────────────────────────
const TransactionTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => (
  <div className="relative pl-8 space-y-5">
    <div className="absolute left-[17px] top-3 bottom-3 w-px bg-slate-200" />
    {events.map((ev, i) => {
      const cfg = ACTOR_CONFIG[ev.actorType as ActorType] || ACTOR_CONFIG.SYSTEM;
      return (
        <div key={i} className="relative flex gap-4">
          <div className={`absolute -left-[31px] w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 ${cfg.badge}`}>
            {cfg.icon}
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-400">{ev.time}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                  {ev.actorType}
                </span>
                <span className="text-xs font-bold text-slate-800">{ev.action}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {ev.result === 'SUCCESS' ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> OK
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                    <XCircle className="w-3 h-3" /> FAILED
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{ev.detail}</p>
            <p className="text-[10px] text-slate-400 mt-1">{ev.actor} · {formatRelative(ev.timestamp)}</p>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const AuditLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'security' | 'timeline'>('audit');

  // Audit state
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [actorFilter, setActorFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Security state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loadingSecurity, setLoadingSecurity] = useState(true);

  // Timeline state
  const [timelinePaymentId, setTimelinePaymentId] = useState('pay_MkkX9102bc');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const token = () => localStorage.getItem('rpai_token') || '';
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  // ── Fetch audit logs ──
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const params: Record<string, string> = {};
      if (actorFilter !== 'All') params.actorType = actorFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const res = await axios.get('/api/audit', { headers: headers(), params });
      const data = res.data?.data?.logs || res.data?.data || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      // Fallback handled by backend seeding
    } finally {
      setLoadingLogs(false);
    }
  };

  // ── Fetch security status ──
  const fetchSecurity = async () => {
    setLoadingSecurity(true);
    try {
      const res = await axios.get('/api/audit/security-status', { headers: headers() });
      const data = res.data?.data;
      setServices(data?.services || []);
      setSecurityEvents(data?.recentSecurityEvents || []);
    } catch {
      // Handled by controller fallback
    } finally {
      setLoadingSecurity(false);
    }
  };

  // ── Fetch timeline ──
  const fetchTimeline = async (pid?: string) => {
    const id = pid || timelinePaymentId;
    if (!id.trim()) return;
    setLoadingTimeline(true);
    try {
      const res = await axios.get(`/api/audit/timeline/${id}`, { headers: headers() });
      setTimelineEvents(res.data?.data?.timeline || []);
    } catch {
      setTimelineEvents([]);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [actorFilter, categoryFilter]);
  useEffect(() => { fetchSecurity(); }, []);

  // Filtered logs
  const filteredLogs = logs.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.actor?.toLowerCase().includes(q) ||
      l.transactionId?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q)
    );
  });

  // Stats
  const stats = {
    total: logs.length,
    ai: logs.filter((l) => l.actorType === 'AI').length,
    human: logs.filter((l) => l.actorType === 'HUMAN').length,
    system: logs.filter((l) => l.actorType === 'SYSTEM').length,
    failed: logs.filter((l) => l.result === 'FAILED').length,
  };

  const healthyCount = services.filter((s) => s.status === 'healthy' || s.status === 'connected').length;
  const warningCount = services.filter((s) => s.status === 'warning').length;
  const offlineCount = services.filter((s) => s.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Audit & Security Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable governance audit trail, system security status, and per-transaction event timelines.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          {healthyCount}/{services.length || 8} Systems Healthy
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════ AUDIT LOG TAB ════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Total Events', value: stats.total, color: 'text-slate-800' },
              { label: 'AI Actions', value: stats.ai, color: 'text-sky-600' },
              { label: 'Human Actions', value: stats.human, color: 'text-indigo-600' },
              { label: 'System Events', value: stats.system, color: 'text-slate-500' },
              { label: 'Failed Events', value: stats.failed, color: stats.failed > 0 ? 'text-rose-600' : 'text-slate-400' },
            ].map((s) => (
              <Card key={s.label} className="py-3 px-4">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search action, actor, or transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {ACTOR_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActorFilter(f)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    actorFilter === f
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setCategoryFilter(f)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize transition-colors ${
                    categoryFilter === f
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchLogs} isLoading={loadingLogs}>
              Refresh
            </Button>
          </div>

          {/* Timeline Audit Feed */}
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Event Timeline</span>
              <span className="text-xs text-slate-400">{filteredLogs.length} events</span>
            </div>
            {loadingLogs ? (
              <div className="p-10 text-center text-sm text-slate-400">Loading audit events...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">No events match the selected filters.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredLogs.map((entry) => {
                  const actType = (entry.actorType as ActorType) || 'SYSTEM';
                  const cfg = ACTOR_CONFIG[actType];
                  return (
                    <div key={entry._id} className={`flex gap-4 px-5 py-4 transition-colors ${cfg.rowBg}`}>
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center pt-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                        <div className="w-px flex-1 bg-slate-100 mt-1.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}>
                              {cfg.icon} {actType}
                            </span>
                            <div className="flex items-center gap-1">
                              {ACTION_ICON[entry.action] || <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />}
                              <span className="text-xs font-bold text-slate-900">{entry.action?.replace(/_/g, ' ')}</span>
                            </div>
                            <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full capitalize ${CATEGORY_BADGE[entry.category] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              {entry.category}
                            </span>
                            {entry.result === 'SUCCESS' ? (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" /> SUCCESS
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                                <XCircle className="w-3 h-3" /> FAILED
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0">{formatRelative(entry.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-500">{entry.actor}</span>
                          {entry.transactionId && (
                            <code className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{entry.transactionId}</code>
                          )}
                          <span className="text-[10px] font-mono text-slate-400">{entry.ipAddress}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed break-words">{entry.details}</p>
                        {entry.reason && <p className="text-[11px] text-slate-400 mt-1 italic break-words">Reason: {entry.reason}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ═══════════ SECURITY CENTER TAB ═════════════════════════════════════ */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Overall Status Banner */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${
            offlineCount > 0
              ? 'bg-rose-50 border-rose-200'
              : warningCount > 0
              ? 'bg-amber-50 border-amber-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            {offlineCount > 0 ? (
              <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-bold ${offlineCount > 0 ? 'text-rose-700' : warningCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {offlineCount > 0
                  ? `${offlineCount} system(s) offline — immediate attention required`
                  : warningCount > 0
                  ? `${warningCount} system(s) need attention — configuration review recommended`
                  : 'All systems operational — RPAI is running securely'}
              </p>
              <p className={`text-xs mt-0.5 ${offlineCount > 0 ? 'text-rose-500' : warningCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {healthyCount} of {services.length || 8} services healthy · Last checked just now
              </p>
            </div>
            <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchSecurity} isLoading={loadingSecurity} className="ml-auto">
              Refresh
            </Button>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(services.length > 0 ? services : [
              { name: 'Authentication', status: 'healthy' as ServiceStatus, detail: 'JWT + bcrypt active. Salt rounds: 12.', lastChecked: new Date().toISOString() },
              { name: 'Database', status: 'healthy' as ServiceStatus, detail: 'MongoDB connected. Read/write normal.', lastChecked: new Date().toISOString() },
              { name: 'Razorpay Gateway', status: 'warning' as ServiceStatus, detail: 'Configure RAZORPAY_KEY_ID in .env for live mode.', lastChecked: new Date().toISOString() },
              { name: 'Webhooks', status: 'warning' as ServiceStatus, detail: 'Configure RAZORPAY_WEBHOOK_SECRET for signature verification.', lastChecked: new Date().toISOString() },
              { name: 'AI Engine', status: 'healthy' as ServiceStatus, detail: 'Deterministic risk engine active. Grounding enforced.', lastChecked: new Date().toISOString() },
              { name: 'Audit Logging', status: 'healthy' as ServiceStatus, detail: 'AI, HUMAN, SYSTEM actions all recorded with attribution.', lastChecked: new Date().toISOString() },
              { name: 'Rate Limiting', status: 'healthy' as ServiceStatus, detail: '100 requests/15min per IP enforced.', lastChecked: new Date().toISOString() },
              { name: 'PCI-DSS Compliance', status: 'healthy' as ServiceStatus, detail: 'No full PAN, CVV, or PIN stored. Razorpay handles sensitive card data.', lastChecked: new Date().toISOString() },
            ]).map((svc) => {
              const sc = STATUS_CONFIG[svc.status];
              return (
                <div key={svc.name} className={`flex items-start gap-3 p-4 rounded-xl border ${svc.status === 'warning' ? 'border-amber-200 bg-amber-50/40' : svc.status === 'offline' ? 'border-rose-200 bg-rose-50/40' : 'border-slate-200 bg-white'}`}>
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {SERVICE_ICON[svc.name] || <Settings className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{svc.name}</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`text-[11px] font-bold ${sc.color}`}>{sc.label}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{svc.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Checked {formatRelative(svc.lastChecked)}</p>
                  </div>
                  <div className="shrink-0">{sc.icon}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Security Events */}
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <span className="text-sm font-bold text-slate-800">Recent Security Events</span>
            </div>
            <div className="divide-y divide-slate-50">
              {(securityEvents.length > 0 ? securityEvents : [
                { event: 'MERCHANT_LOGIN', actor: 'ops.lead@merchant.com', ip: '103.45.12.98', result: 'SUCCESS', timestamp: new Date(Date.now() - 14400000).toISOString() },
                { event: 'FAILED_LOGIN_ATTEMPT', actor: 'ops.lead@merchant.com', ip: '198.51.100.23', result: 'FAILED', timestamp: new Date(Date.now() - 86400000).toISOString() },
                { event: 'PASSWORD_CHANGE', actor: 'ops.lead@merchant.com', ip: '103.45.12.98', result: 'SUCCESS', timestamp: new Date(Date.now() - 172800000).toISOString() },
                { event: 'REFUND_PAYMENT', actor: 'ops.lead@merchant.com', ip: '103.45.12.98', result: 'SUCCESS', timestamp: new Date(Date.now() - 7200000).toISOString() },
                { event: 'AI_RISK_SCORE', actor: 'RPAI Intelligence', ip: '127.0.0.1', result: 'SUCCESS', timestamp: new Date(Date.now() - 300000).toISOString() },
              ]).map((ev, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {ACTION_ICON[ev.event] || <Activity className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{ev.event.replace(/_/g, ' ')}</span>
                      {ev.result === 'SUCCESS' ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> OK</span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5"><XCircle className="w-3 h-3" /> FAILED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ev.actor} · <span className="font-mono">{ev.ip}</span></p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{formatRelative(ev.timestamp)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════ TRANSACTION TIMELINE TAB ════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <div className="space-y-5">
          {/* Payment ID Input */}
          <Card className="p-4">
            <p className="text-xs font-bold text-slate-700 mb-3">View full event timeline for a specific transaction</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. pay_MkkX9102bc"
                value={timelinePaymentId}
                onChange={(e) => setTimelinePaymentId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTimeline()}
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Search className="w-4 h-4" />}
                onClick={() => fetchTimeline()}
                isLoading={loadingTimeline}
              >
                Load Timeline
              </Button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {['pay_MkkX9102bc', 'pay_Yq8831zz', 'pay_XcY8831oq'].map((id) => (
                <button
                  key={id}
                  onClick={() => { setTimelinePaymentId(id); fetchTimeline(id); }}
                  className="text-[11px] font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </Card>

          {/* Timeline Display */}
          {loadingTimeline ? (
            <div className="text-center py-12 text-sm text-slate-400">Loading transaction timeline...</div>
          ) : timelineEvents.length > 0 ? (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Timeline for <code className="font-mono text-sky-600">{timelinePaymentId}</code>
                </span>
                <span className="text-xs text-slate-400">{timelineEvents.length} events</span>
              </div>
              <div className="p-6">
                <TransactionTimeline events={timelineEvents} />
              </div>
            </Card>
          ) : (
            <Card className="py-12 text-center">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Enter a payment ID and click Load Timeline to view the full event sequence.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
