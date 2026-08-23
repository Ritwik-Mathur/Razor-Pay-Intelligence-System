import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/ui/StatsCard';
import { Modal } from '../../components/ui/Modal';
import { ROUTES } from '../../utils/constants';
import {
  Building,
  TrendingUp,
  Award,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
  Bot,
  Zap,
  Sliders,
  DollarSign,
  ShieldAlert,
  ChevronRight,
  Send,
  UserCheck,
  CreditCard,
  Building2,
  Calendar,
  X,
  FileCheck2,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const CreditOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Score state
  const [currentScore, setCurrentScore] = useState(78);
  const previousScore = 65;
  const projectedScore = 84;
  const overallStatus = 'Strong';

  // Modals & Drawers
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Copilot Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am CreditGrow Copilot 👋 I analyze Sharma Electronics financial telemetry to help you improve your credit readiness score. How can I help you today?',
      time: '13:42',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const scoreComponents = [
    { name: 'Revenue Stability', score: 88, weight: '20%', color: '#4f46e5' },
    { name: 'Cash Flow Health', score: 74, weight: '20%', color: '#0ea5e9' },
    { name: 'Payment Behaviour', score: 91, weight: '20%', color: '#10b981' },
    { name: 'Repayment Behaviour', score: 95, weight: '15%', color: '#059669' },
    { name: 'Supplier Behaviour', score: 82, weight: '10%', color: '#f59e0b' },
    { name: 'Business Stability', score: 79, weight: '10%', color: '#6366f1' },
    { name: 'Digital Financial Footprint', score: 71, weight: '5%', color: '#8b5cf6' },
  ];

  const improvementPlan = [
    {
      priority: 'HIGH',
      problem: 'Payment failures increased by 4% during peak settlement windows',
      recommendation: 'Reduce payment failures by maintaining sufficient account balance & 2FA readiness',
      reason: 'Reduces payment drop penalty on Payment Behaviour score',
      estimatedImpact: '+4 to +6 CreditGrow points',
      timeframe: '1–2 months',
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
    },
    {
      priority: 'HIGH',
      problem: 'Cash reserve dips below ₹20,000 threshold during inventory cycles',
      recommendation: 'Maintain minimum ₹25,000 emergency cash reserve buffer',
      reason: 'Stabilizes cash flow volatility score component',
      estimatedImpact: '+3 to +5 CreditGrow points',
      timeframe: '2–3 months',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
    },
    {
      priority: 'MEDIUM',
      problem: '91% supplier on-time payment rate leaves 9% minor payable delays',
      recommendation: 'Pay all vendor obligations at least 2 days before due dates',
      reason: 'Boosts Supplier Behaviour component to 90+',
      estimatedImpact: '+2 to +4 CreditGrow points',
      timeframe: '1 month',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
    },
    {
      priority: 'MEDIUM',
      problem: '27% of total revenue is merchant-reported cash sales (₹65,000/mo)',
      recommendation: 'Increase documented digital transactions via Razorpay UPI & QR',
      reason: 'Improves Digital Financial Footprint weight',
      estimatedImpact: '+2 to +3 CreditGrow points',
      timeframe: '3–6 months',
      bg: 'bg-sky-50 border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
    },
  ];

  const riskAlerts = [
    { type: 'warning', text: 'Expense volatility increased by 6% in April inventory restock cycle' },
    { type: 'warning', text: 'Merchant-reported cash revenue makes up 27% of total business volume' },
    { type: 'success', text: 'Payment success rate maintained at high 96% across 34 Razorpay orders' },
    { type: 'success', text: '100% obligation repayment record verified with zero defaults' },
  ];

  const handleSendMessage = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    setTimeout(() => {
      let replyText = 'Based on Sharma Electronics financial telemetry, your score is strong at 78/100. Focus on reducing payment drops and maintaining a ₹25,000 cash reserve to reach 84/100.';
      const lower = textToSend.toLowerCase();

      if (lower.includes('why') || lower.includes('decrease') || lower.includes('score')) {
        replyText = 'Your score is 78/100 (Strong). Positive factors include +8 for stable ₹2.4L revenue and +7 for 100% repayment discipline. Negative factors reducing your score are -5 for expense volatility and -4 for occasional supplier payment delays.';
      } else if (lower.includes('improve') || lower.includes('how')) {
        replyText = 'To improve your score from 78 to 84: 1) Maintain a ₹25k emergency cash reserve, 2) Pay suppliers 2 days before due dates (+3 pts), 3) Reduce payment failures below 3% (+5 pts).';
      } else if (lower.includes('credit') || lower.includes('ready') || lower.includes('loan')) {
        replyText = 'Based on available business data, Sharma Electronics currently demonstrates STRONG credit readiness with ₹65,000 net monthly cash flow. You are well-positioned for working capital financing up to ₹5,000,000.';
      } else if (lower.includes('revenue') || lower.includes('cash')) {
        replyText = 'Sharma Electronics earns ₹2,40,000 monthly (₹1,75,000 digital via Razorpay and ₹65,000 merchant-reported cash sales). Increasing digital share will boost your Digital Footprint score.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ─── HEADER BAR ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CreditGrow AI</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              Business Credit Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            AI-generated Credit Readiness Platform for MSMEs · Sharma Electronics (Electronics Retail)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_REVENUE)}
            leftIcon={<Sliders className="w-3.5 h-3.5 text-amber-500" />}
          >
            Cash + Digital Revenue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_SIMULATOR)}
            leftIcon={<Calculator className="w-3.5 h-3.5 text-indigo-600" />}
          >
            Credit Simulator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_JOURNEY)}
            leftIcon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Credit Journey
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREDIT_REPORT)}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
          >
            Readiness Report
          </Button>
        </div>
      </div>

      {/* ─── MANDATORY RESPONSIBLE LENDING NOTICE ────────────────────────────── */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Responsible Lending & Credit Readiness Notice:</span>
          <span>
            CreditGrow Score is an <strong>AI-generated Business Credit Readiness Indicator</strong> to help merchants improve financial health. It is <strong>NOT an official credit-bureau or CIBIL score</strong> and does not guarantee loan financing or automatic approval.
          </span>
        </div>
      </div>

      {/* ─── SCORE HERO & FINANCIAL HEALTH METRICS ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SCORE GAUGE CARD (5 cols) */}
        <Card className="lg:col-span-5 p-6 border-slate-200 banking-card-shadow flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BUSINESS CREDIT SCORE</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Readiness: STRONG
            </span>
          </div>

          {/* CIRCULAR SVG SCORE VISUALIZATION */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="9" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#4f46e5"
                strokeWidth="9"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * currentScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{currentScore}</span>
              <span className="text-xs text-slate-400 font-bold">/ 100</span>
              <span className="text-[10px] font-extrabold text-emerald-600 mt-0.5">Overall: {overallStatus}</span>
            </div>
          </div>

          {/* SCORE METRICS ROW */}
          <div className="grid grid-cols-3 w-full border-t border-slate-100 pt-4 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">PREVIOUS</span>
              <span className="text-sm font-bold text-slate-700">{previousScore}</span>
            </div>
            <div className="border-x border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">CURRENT</span>
              <span className="text-sm font-black text-indigo-600">{currentScore}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">PROJECTED</span>
              <span className="text-sm font-bold text-emerald-600">84</span>
            </div>
          </div>

          {/* EXPLAINABILITY BUTTON */}
          <Button
            variant="outline"
            className="w-full text-xs font-bold"
            onClick={() => setShowExplainModal(true)}
            leftIcon={<HelpCircle className="w-4 h-4 text-indigo-600" />}
          >
            Why is my score {currentScore}?
          </Button>
        </Card>

        {/* FINANCIAL TELEMETRY OVERVIEW (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              title="Monthly Revenue"
              value="₹2,40,000"
              change={8.5}
              icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
              subtitle="Digital ₹1.75L | Cash ₹65k"
            />
            <StatsCard
              title="Monthly Expenses"
              value="₹1,75,000"
              change={-2.1}
              icon={<TrendingUp className="w-5 h-5 text-slate-600" />}
              subtitle="Net Cash Flow: ₹65,000"
            />
            <StatsCard
              title="Payment Success Rate"
              value="96.0%"
              change={2.0}
              icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
              subtitle="Razorpay Payment Telemetry"
            />
            <StatsCard
              title="Supplier On-Time Rate"
              value="91.0%"
              change={4.0}
              icon={<Building2 className="w-5 h-5 text-amber-600" />}
              subtitle="100% Repayment Record"
            />
          </div>

          {/* RISK ALERTS BANNER */}
          <Card className="p-5 border-slate-200 banking-card-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Real-Time Financial Risk Alerts
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">RPAi Agent Feed</span>
            </div>

            <div className="space-y-2">
              {riskAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                    alert.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                      : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <span>{alert.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ─── 7 SCORE COMPONENT BREAKDOWN ──────────────────────────────────────── */}
      <Card className="p-6 border-slate-200 banking-card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Score Factor Breakdown (Weighted Model)</h2>
            <p className="text-xs text-slate-500">Transparent components contributing to your CreditGrow Score</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            7 Weighted Factors
          </span>
        </div>

        <div className="space-y-3">
          {scoreComponents.map((c, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name} <span className="text-slate-400 font-normal">({c.weight})</span>
                </span>
                <span className="font-extrabold text-slate-900">{c.score} <span className="text-slate-400 text-[10px] font-normal">/ 100</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.score}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── CREDIT IMPROVEMENT PLAN ("IMPROVE MY SCORE") ─────────────────────── */}
      <Card className="p-6 border-slate-200 banking-card-shadow space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-slate-900">Credit Improvement Plan</h2>
            </div>
            <p className="text-xs text-slate-500">Actionable recommendations generated by Credit Coach Agent to reach projected 84 score</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase">PROJECTED TIMELINE</span>
            <span className="text-xs font-extrabold text-emerald-600">3–6 Months (+6 pts)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvementPlan.map((plan, index) => (
            <div key={index} className={`p-4 rounded-xl border space-y-2.5 ${plan.bg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${plan.badgeBg}`}>
                  {plan.priority} PRIORITY
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded border border-indigo-100">
                  {plan.estimatedImpact}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">PROBLEM</span>
                <p className="text-xs font-bold text-slate-900">{plan.problem}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">RECOMMENDED ACTION</span>
                <p className="text-xs font-medium text-slate-800">{plan.recommendation}</p>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                <span>Reason: {plan.reason}</span>
                <span className="font-semibold text-slate-700">Target: {plan.timeframe}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── FLOATING CREDITGROW COPILOT BUTTON & DRAWER ─────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCopilot(!showCopilot)}
          className="rounded-full shadow-2xl px-5 py-3 flex items-center gap-2 border-2 border-white"
        >
          <Bot className="w-5 h-5 text-amber-300" />
          <span>CreditGrow Copilot</span>
        </Button>
      </div>

      {/* COPILOT CHAT DRAWER */}
      {showCopilot && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[500px] overflow-hidden">
          {/* DRAWER HEADER */}
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="text-sm font-bold">CreditGrow Copilot</h3>
                <span className="text-[10px] text-indigo-200 block">AI Financial Assistant · Connected to Telemetry</span>
              </div>
            </div>
            <button onClick={() => setShowCopilot(false)} className="text-indigo-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PRESET CHAT SUGGESTIONS */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              'Why is my score 78?',
              'How to improve score?',
              'Am I ready for credit?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shrink-0 font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Copilot about your credit readiness..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── WHY IS MY SCORE 78? AI EXPLAINABILITY MODAL ───────────────────────── */}
      <Modal isOpen={showExplainModal} onClose={() => setShowExplainModal(false)} title="Why is my score 78/100?">
        <div className="space-y-4 text-slate-900">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 leading-relaxed">
            <span className="font-bold block text-indigo-900 mb-1">🧠 Credit Coach AI Explanation</span>
            "Your score is <strong>78/100 (Strong)</strong> because your business revenue has remained stable at ₹2,40,000 for 36 months, and you maintain a 100% obligation repayment record. Your score is currently being reduced primarily by cash-flow expense volatility and 9% supplier payment delays."
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Positive Factors (+ Boosts)</h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950 font-medium">
                <span>+9 Stable monthly revenue (₹2,40,000 avg) over 36 months</span>
                <span className="font-bold text-emerald-700">+9 pts</span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950 font-medium">
                <span>+7 Strong repayment discipline (100% repayment record)</span>
                <span className="font-bold text-emerald-700">+7 pts</span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950 font-medium">
                <span>+5 High payment success rate (96% on Razorpay)</span>
                <span className="font-bold text-emerald-700">+5 pts</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Negative Factors (- Penalties)</h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-950 font-medium">
                <span>-5 Cash flow volatility from monthly expense swings (₹1,75,000)</span>
                <span className="font-bold text-rose-700">-5 pts</span>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-950 font-medium">
                <span>-4 Minor supplier payment delays (91% on-time rate)</span>
                <span className="font-bold text-rose-700">-4 pts</span>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-950 font-medium">
                <span>-2 Limited digital transaction share (27% cash revenue)</span>
                <span className="font-bold text-rose-700">-2 pts</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowExplainModal(false)}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
