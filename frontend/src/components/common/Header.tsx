import React, { useState } from 'react';
import { RpaiLogo } from './RpaiLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useTestMode } from '../../contexts/TestModeContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { SearchModal } from './SearchModal';
import { Tooltip } from '../ui/Tooltip';
import {
  Search,
  Bell,
  Menu,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Settings,
  Activity,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isTestMode, toggleTestMode } = useTestMode();
  const { toggleMobile, toggleSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'High-risk payment detected', desc: 'pay_MkkX9102bc flagged with risk score 78', time: '10m ago' },
    { id: 2, title: 'Recovery link sent', desc: 'WhatsApp retry dispatched to Priya Patel', time: '45m ago' },
    { id: 3, title: 'Reconciliation sync complete', desc: '1,240 records verified against Razorpay statement', time: '2h ago' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 banking-header-shadow select-none">
      <div className="px-4 py-2 flex items-center justify-between gap-3 md:gap-4">
        {/* Left Side: Mobile Menu + Desktop Sidebar Toggle + Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button onClick={() => navigate(ROUTES.DASHBOARD)} className="focus:outline-none flex items-center">
            <RpaiLogo size="md" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center justify-between text-slate-400 text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="truncate">Search transactions, cards, risk alerts (⌘K)...</span>
            </div>
            <kbd className="hidden lg:inline-block bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Status Indicators & User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Razorpay: CONNECTED Badge */}
          <Tooltip content="Connected to Razorpay Test Gateway API">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Razorpay:</span>
              <span className="text-emerald-700 font-black">CONNECTED</span>
            </div>
          </Tooltip>

          {/* Environment: TEST MODE Badge */}
          <Tooltip content="Click to toggle Test / Live simulation mode">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Environment:</span>
              <button onClick={toggleTestMode} className="font-black text-amber-700 hover:underline">
                {isTestMode ? 'TEST MODE' : 'LIVE MODE'}
              </button>
            </div>
          </Tooltip>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Notifications</h4>
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      navigate(ROUTES.NOTIFICATIONS);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate(ROUTES.NOTIFICATIONS);
                      }}
                      className="p-3 hover:bg-slate-50 text-xs cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5 text-[11px]">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-extrabold text-slate-900 tracking-tight leading-none">
                  {user?.fullName || 'Ritwik'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{user?.businessName || 'Merchant Ops'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-extrabold text-slate-900">{user?.fullName || 'Ritwik'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'operations@merchant.com'}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {user?.merchantId || 'mch_rpai_live_8910'}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(ROUTES.PROFILE);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" /> Profile & Credentials
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(ROUTES.SETTINGS);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Security & Governance
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate(ROUTES.LOGIN);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
