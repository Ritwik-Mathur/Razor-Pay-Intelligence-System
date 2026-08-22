import React from 'react';
import { Shield, Activity, Cpu } from 'lucide-react';
import { APP_INFO } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-3 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-700">{APP_INFO.name}</span> - {APP_INFO.fullName} &copy; {new Date().getFullYear()}
      </div>

      <div className="flex items-center gap-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-emerald-500" /> Razorpay Test Gateway: Connected
        </span>
        <span className="inline-flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-blue-500" /> AI Agent Risk Model: v2.4
        </span>
      </div>
    </footer>
  );
};
