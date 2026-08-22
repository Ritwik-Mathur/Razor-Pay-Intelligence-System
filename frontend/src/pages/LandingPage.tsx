import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RpaiLogo } from '../components/common/RpaiLogo';
import { Button } from '../components/ui/Button';
import { ROUTES, APP_INFO } from '../utils/constants';
import {
  ShieldCheck,
  Cpu,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Activity,
  CheckCircle2,
  Lock,
  CreditCard,
  Scale,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ─── Header Navigation ─────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate(ROUTES.HOME)} className="focus:outline-none">
            <RpaiLogo size="lg" variant="light" />
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button onClick={() => navigate(ROUTES.DASHBOARD)} className="hover:text-sky-400 transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate(ROUTES.PAYMENTS)} className="hover:text-sky-400 transition-colors">
              Payments
            </button>
            <button onClick={() => navigate(ROUTES.RISK_CENTER)} className="hover:text-sky-400 transition-colors">
              Risk Center
            </button>
            <button onClick={() => navigate(ROUTES.RECOVERY)} className="hover:text-sky-400 transition-colors">
              Recovery
            </button>
            <button onClick={() => navigate(ROUTES.AI_ASSISTANT)} className="hover:text-sky-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> RPAI AI
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)} className="text-slate-300 hover:text-white">
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.REGISTER)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Register Account
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section with Featured Photo Overlay ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 flex flex-col justify-center w-full">
        {/* Main Hero Card Container */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Background Hero Image */}
          <div className="relative w-full min-h-[480px] md:min-h-[560px]">
            <img
              src="/hero-family.jpg"
              alt="RPAI Payment Operations Hero"
              className="w-full h-full object-cover object-center absolute inset-0"
            />
            {/* Gradient Overlays for Crisp Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

            {/* Content Overlaid on Top of Image */}
            <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl flex flex-col justify-between h-full min-h-[480px] md:min-h-[560px]">
              {/* Top Tagline */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-sky-400 text-xs font-bold backdrop-blur-md">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>RPAI — Detect. Decide. Recover.</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Intelligent Payment Command Center
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  Turn Razorpay payment telemetry into active fraud defense. Detect anomalies, analyze risk scores, execute controlled AI actions, and recover failed transactions.
                </p>
              </div>

              {/* OVERLAID ACTION BUTTONS */}
              <div className="pt-6 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg shadow-blue-600/30 h-12 px-6 text-sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Command Center
                  </Button>

                  <Button
                    size="lg"
                    variant="success"
                    onClick={() => navigate(ROUTES.PAYMENT_CREATE)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/20 h-12 px-5 text-sm"
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Make Test Payment
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate(ROUTES.AI_ASSISTANT)}
                    className="border-sky-500/50 bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 font-bold backdrop-blur-md h-12 px-5 text-sm"
                    leftIcon={<Sparkles className="w-4 h-4 text-sky-400" />}
                  >
                    Ask RPAI AI
                  </Button>
                </div>

                {/* Secondary Quick Login Bar */}
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="flex items-center gap-1.5 hover:text-white font-semibold transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-400" />
                    <span>Existing Merchant Login &rarr;</span>
                  </button>
                  <span>•</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Razorpay Test Gateway Connected</span>
                </div>
              </div>

              {/* Live Metric Badges Overlaid at Bottom */}
              <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Conversion Rate</span>
                  <span className="text-base font-black text-emerald-400">95.26% Success</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Processed Volume</span>
                  <span className="text-base font-black text-white">₹42,85,000</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Risk Scoring</span>
                  <span className="text-base font-black text-sky-400">0 - 100 Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Grid Section ───────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Autonomous Fraud Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic rule-based risk engine evaluating amount anomalies, velocity bursts, and new device telemetry.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Smart Payment Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated multi-channel recovery workflows for 3DS verification drops and failed customer checkouts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Grounded AI Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask natural language questions powered by OpenAI ChatGPT & Gemini LLMs grounded in live merchant database telemetry.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">3-Way Reconciliation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify internal transaction records against Razorpay bank statements with AI discrepancy explanations.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <p>&copy; {new Date().getFullYear()} RPAI &mdash; Razor Pay Artificial Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
};
