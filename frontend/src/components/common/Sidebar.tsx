import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { cn } from '../../utils/cn';
import { ROUTES } from '../../utils/constants';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Users,
  ShieldAlert,
  RotateCcw,
  Scale,
  Sparkles,
  FileCheck2,
  User,
  Settings,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  Calculator,
  Bot,
  Lock,
  PieChart,
  UserCheck,
  Sliders,
  Cpu,
  Zap,
  ShieldCheck as CreditShield,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const location = useLocation();

  const navigation: NavGroup[] = [
    {
      group: 'MAIN OPERATIONS',
      items: [
        { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: 'Payments', path: ROUTES.PAYMENTS, icon: Receipt },
        { name: 'Cards & Methods', path: ROUTES.CARDS, icon: CreditCard },
        { name: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
      ],
    },
    {
      group: 'CREDIT INTELLIGENCE',
      items: [
        { name: 'Credit Overview', path: ROUTES.CREDIT_OVERVIEW, icon: Building2, highlight: true },
        { name: 'Applicants', path: ROUTES.CREDIT_APPLICANTS, icon: Users },
        { name: 'Credit Assessment', path: ROUTES.CREDIT_APPLY, icon: FileText },
        { name: 'Alternative Data', path: ROUTES.CREDIT_PRIVACY, icon: Sliders },
        { name: 'Risk Profile', path: '/credit/profile/demo_app_001', icon: PieChart },
        { name: 'Loan Simulator', path: ROUTES.CREDIT_SIMULATOR, icon: Calculator },
        { name: 'AI Credit Advisor', path: ROUTES.CREDIT_AI, icon: Bot },
        { name: 'Consent & Privacy', path: ROUTES.CREDIT_PRIVACY, icon: Lock },
      ],
    },
    {
      group: 'INTELLIGENCE & RECOVERY',
      items: [
        { name: 'Risk Center', path: ROUTES.RISK_CENTER, icon: ShieldAlert, badge: '9 Risk' },
        { name: 'Recovery', path: ROUTES.RECOVERY, icon: RotateCcw },
        { name: 'Reconciliation', path: ROUTES.RECONCILIATION, icon: Scale },
      ],
    },
    {
      group: 'RPAI INTELLIGENCE',
      items: [
        { name: 'RPAI AI', path: ROUTES.AI_ASSISTANT, icon: Sparkles },
        { name: 'Payment Agent', path: ROUTES.AGENTS_LANDING, icon: Zap, highlight: true },
        { name: 'Action Approvals', path: ROUTES.ACTION_APPROVALS, icon: UserCheck, badge: '2 Pending' },
        { name: 'Audit Logs', path: ROUTES.AUDIT_LOGS, icon: FileCheck2 },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { name: 'Profile', path: ROUTES.PROFILE, icon: User },
        { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
        { name: 'Creator', path: '/creator', icon: Sparkles, highlight: true },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Mobile Drawer Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span className="font-bold text-white tracking-wider text-sm uppercase">RPAI Banking</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
        {navigation.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive: linkActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group relative',
                        linkActive || isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                          : item.highlight
                          ? 'text-sky-300 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      )
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1 flex items-center justify-between">
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
