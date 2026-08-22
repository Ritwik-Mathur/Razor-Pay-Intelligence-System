import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles,
  DollarSign,
  Filter,
  CheckCheck,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const [notifications, setNotifications] = useState([
    {
      id: 'ntf_001',
      title: 'Payment Received',
      message: 'Payment of ₹45,000 from Aarav Sharma captured successfully via Visa •••• 4242.',
      type: 'payment_received',
      severity: 'success',
      isRead: false,
      relatedId: 'pay_NzkX9218ab',
      route: '/payments/pay_NzkX9218ab',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ntf_002',
      title: 'High-Risk Transaction Detected',
      message: 'RPAI AI flagged payment pay_MkkX9102bc with risk score 78/100. Velocity spike from VPN endpoint detected.',
      type: 'risk_detected',
      severity: 'critical',
      isRead: false,
      relatedId: 'pay_MkkX9102bc',
      route: '/risk-center',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'ntf_003',
      title: 'Payment Failed',
      message: '3DS verification failed for ₹1,28,000 order from Priya Patel. Recovery workflow initiated.',
      type: 'payment_failed',
      severity: 'warning',
      isRead: false,
      relatedId: 'pay_MkkX9102bc',
      route: '/recovery',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'ntf_004',
      title: 'Refund Completed',
      message: 'Refund of ₹3,200 for transaction pay_Ref99182ab processed and settled to customer account.',
      type: 'refund_completed',
      severity: 'info',
      isRead: true,
      relatedId: 'pay_Ref99182ab',
      route: '/payments',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'ntf_005',
      title: 'AI Investigation Completed',
      message: 'RPAI Intelligence completed anomaly breakdown report for 1,248 transactions in current window.',
      type: 'ai_complete',
      severity: 'success',
      isRead: true,
      relatedId: 'ai_rep_102',
      route: '/ai-assistant',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_received':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'risk_detected':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'payment_failed':
        return <XCircle className="w-5 h-5 text-amber-600" />;
      case 'refund_completed':
        return <RotateCcw className="w-5 h-5 text-blue-600" />;
      case 'ai_complete':
        return <Sparkles className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="danger">Critical Risk</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'success':
        return <Badge variant="success">Success</Badge>;
      default:
        return <Badge variant="info">Information</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Notification & Alert Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time payment events, fraud alerts, AI analysis, and recovery status.</p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<CheckCheck className="w-4 h-4 text-emerald-600" />}>
          Mark All as Read
        </Button>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'unread', 'payment_received', 'payment_failed', 'risk_detected', 'refund_completed', 'ai_complete'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-colors ${
                filterType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No notifications match the selected filter.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markItemRead(n.id);
                  if (n.route) navigate(n.route);
                }}
                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer rounded-xl ${
                  !n.isRead ? 'bg-blue-50/40 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                  <div className="pt-1 flex items-center justify-between">
                    {getSeverityBadge(n.severity)}
                    <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                      View Operational Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
