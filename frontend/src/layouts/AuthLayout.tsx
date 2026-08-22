import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { RpaiLogo } from '../components/common/RpaiLogo';
import { ShieldCheck, RefreshCw, Zap, ArrowLeft } from 'lucide-react';
import { APP_INFO, ROUTES } from '../utils/constants';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-slate-900 font-sans transition-colors duration-300">
      {/* Left Marketing / Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <button onClick={() => navigate(ROUTES.HOME)} className="focus:outline-none transition-transform hover:scale-105">
            <RpaiLogo size="lg" variant="light" />
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-all duration-200 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Next-Gen Merchant Banking Infrastructure
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            {APP_INFO.tagline}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            RPAI turns payment data into active defense. Powered by Razorpay Test Gateway integration, real-time risk telemetry, and automated failed payment recovery.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Autonomous Fraud Shield</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Detects suspicious velocity, card BIN anomalies, and geo-spikes instantly.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Smart Payment Recovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Automated multi-channel nudges for failed 3DS transactions.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>{APP_INFO.secondaryTagline}</span>
          <span>&copy; {new Date().getFullYear()} RPAI Technologies</span>
        </div>
      </div>

      {/* Right Form Container with Top Back Button */}
      <div className="flex-1 flex flex-col justify-between p-6 lg:p-12 bg-slate-50 relative min-h-screen">
        {/* Top Header Navigation for Mobile / Tablet */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-4">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <Link to={ROUTES.HOME} className="lg:hidden">
            <RpaiLogo size="md" />
          </Link>
        </div>

        {/* Form Outlet with Fade-In Animation */}
        <div className="w-full max-w-md mx-auto my-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Outlet />
        </div>

        {/* Footer info on mobile */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 pt-4">
          <p>&copy; {new Date().getFullYear()} RPAI. Secure 256-Bit SSL Encrypted.</p>
        </div>
      </div>
    </div>
  );
};
