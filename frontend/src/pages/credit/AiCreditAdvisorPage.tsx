import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Building2,
  FileCheck2,
  UserCheck,
  Zap,
  Info,
} from 'lucide-react';

export const AiCreditAdvisorPage: React.FC = () => {
  const [activeAgentTab, setActiveAgentTab] = useState<'coach' | 'cashflow' | 'payment' | 'stability' | 'supplier' | 'repayment'>('coach');
  const [inputQuery, setInputQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am CreditCoach AI 🧠 I analyze Sharma Electronics financial telemetry to provide custom recommendations to improve your Business Credit Readiness Score.',
      time: '13:42',
    },
  ]);

  const agents = [
    { id: 'coach', name: 'Credit Coach Agent', icon: Bot, badge: 'Main Agent', desc: 'Generates prioritized credit improvement plans & score explanations' },
    { id: 'cashflow', name: 'Cashflow Agent', icon: DollarSign, badge: 'Active', desc: 'Analyzes revenue, expenses, cash flow & reserve volatility' },
    { id: 'payment', name: 'Payment Agent', icon: CreditCard, badge: 'Active', desc: 'Analyzes successful/failed payments, refunds & frequency' },
    { id: 'stability', name: 'Stability Agent', icon: Building2, badge: 'Active', desc: 'Analyzes monthly revenue trends & customer continuity' },
    { id: 'supplier', name: 'Supplier Agent', icon: FileCheck2, badge: 'Active', desc: 'Tracks vendor obligations and on-time payment percentages' },
    { id: 'repayment', name: 'Repayment Agent', icon: UserCheck, badge: 'Active', desc: 'Monitors existing business obligations & debt discipline' },
  ];

  const recommendations = [
    {
      priority: 'HIGH',
      problem: 'Payment failure rate increased by 4% during peak settlement windows',
      action: 'Reduce payment drops by maintaining sufficient balance & 2FA readiness',
      reason: 'Reduces payment drop penalty on Payment Behaviour score',
      impact: '+4 to +6 CreditGrow points',
      timeframe: '1–2 months',
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
    },
    {
      priority: 'HIGH',
      problem: 'Cash reserve dips below ₹20,000 threshold during inventory cycles',
      action: 'Maintain minimum ₹25,000 emergency cash reserve buffer',
      reason: 'Stabilizes cash flow volatility score component',
      impact: '+3 to +5 CreditGrow points',
      timeframe: '2–3 months',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
    },
    {
      priority: 'MEDIUM',
      problem: '91% supplier on-time payment rate leaves 9% minor payable delays',
      action: 'Pay all vendor obligations at least 2 days before due dates',
      reason: 'Boosts Supplier Behaviour component to 90+',
      impact: '+2 to +4 CreditGrow points',
      timeframe: '1 month',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
    },
    {
      priority: 'MEDIUM',
      problem: '27% of total revenue is merchant-reported cash sales (₹65,000/mo)',
      action: 'Increase documented digital transactions via Razorpay UPI & QR',
      reason: 'Improves Digital Financial Footprint weight',
      impact: '+2 to +3 CreditGrow points',
      timeframe: '3–6 months',
      bg: 'bg-sky-50 border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
    },
  ];

  const presetQuestions = [
    'Why did my score decrease?',
    'How can I improve my score?',
    'What is hurting my business the most?',
    'Am I financially ready to seek credit?',
    'What happens if my revenue falls 20%?',
    'How much should I keep as a cash reserve?',
  ];

  const handleSendMessage = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: query, time }]);
    if (!text) setInputQuery('');

    setTimeout(() => {
      let reply = 'Sharma Electronics currently holds a CreditGrow score of 78/100 (Strong). Focus on reducing payment failures and maintaining a ₹25,000 cash reserve to reach 84/100.';
      const lower = query.toLowerCase();

      if (lower.includes('why') || lower.includes('decrease') || lower.includes('hurt')) {
        reply = 'Your score is reduced primarily by 2 factors: 1) Cash-flow volatility from monthly expense swings (₹1,75,000/mo) costing -5 pts, and 2) 9% supplier payment delays costing -4 pts.';
      } else if (lower.includes('improve') || lower.includes('how')) {
        reply = 'Top 3 actions to improve your score from 78 → 84: 1) Maintain ₹25,000 emergency cash reserve (+4 pts), 2) Pay suppliers 2 days early (+3 pts), 3) Reduce payment drops below 3% (+5 pts).';
      } else if (lower.includes('ready') || lower.includes('seek') || lower.includes('credit')) {
        reply = 'Based on available business telemetry, Sharma Electronics currently demonstrates STRONG credit readiness. With ₹65,000 net monthly cash flow and 100% repayment record, you are well-prepared to seek working capital credit.';
      } else if (lower.includes('fall') || lower.includes('drop') || lower.includes('20%')) {
        reply = 'If revenue falls by 20% (to ₹1,92,000), net cash flow decreases from ₹65,000 to ₹17,000. Your CreditGrow score would adjust from 78 to 69 (Good). Maintaining a ₹25,000 reserve prevents it from dropping into Fair status.';
      } else if (lower.includes('reserve') || lower.includes('keep')) {
        reply = 'You should maintain a minimum cash reserve of ₹25,000 (roughly 15% of monthly expenses). This buffer protects your cash-flow health score from volatility penalties.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 banking-card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Credit Coach & Agent Suite</h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              CreditGrow Copilot
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Actionable financial recommendations and conversational AI assistant powered by 6 specialized RPAi agents.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs text-emerald-800 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Credit Readiness: STRONG (78/100)</span>
        </div>
      </div>

      {/* ─── 6 SPECIALIZED AGENTS TABS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgentTab === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setActiveAgentTab(agent.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {agent.badge}
                </span>
              </div>
              <p className="text-xs font-extrabold truncate">{agent.name}</p>
            </button>
          );
        })}
      </div>

      {/* ─── MAIN CONTENT GRID (RECOMMENDATIONS + CHAT COPILOT) ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CREDIT COACH ACTIONABLE RECOMMENDATIONS (7 cols) */}
        <Card className="lg:col-span-7 p-6 border-slate-200 banking-card-shadow space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" /> Credit Coach Action Recommendations
              </h2>
              <p className="text-xs text-slate-500">What Sharma Electronics should do to reach projected 84 score</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              4 Prioritized Actions
            </span>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-xl border space-y-2.5 ${rec.bg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${rec.badgeBg}`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-white/90 px-2.5 py-0.5 rounded border border-indigo-100">
                    {rec.impact}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">IDENTIFIED PROBLEM</span>
                  <p className="text-xs font-bold text-slate-900">{rec.problem}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">RECOMMENDED ACTION</span>
                  <p className="text-xs font-medium text-slate-800">{rec.action}</p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                  <span>Reason: {rec.reason}</span>
                  <span className="font-semibold text-slate-700">Timeframe: {rec.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CREDITGROW COPILOT CHAT INTERFACE (5 cols) */}
        <Card className="lg:col-span-5 p-6 border-slate-200 banking-card-shadow flex flex-col justify-between h-[580px]">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">CreditGrow Copilot</h2>
                <span className="text-[10px] text-slate-400 block font-medium">Grounded in Sharma Electronics Telemetry</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Online
            </span>
          </div>

          {/* MESSAGES SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs my-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
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

          {/* PRESET QUESTIONS GRID */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">SUGGESTED QUESTIONS</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-left font-medium truncate transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FIELD */}
          <div className="flex items-center gap-2 pt-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Copilot about your credit readiness..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
            />
            <Button variant="primary" size="sm" onClick={() => handleSendMessage()} leftIcon={<Send className="w-4 h-4" />}>
              Ask
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
