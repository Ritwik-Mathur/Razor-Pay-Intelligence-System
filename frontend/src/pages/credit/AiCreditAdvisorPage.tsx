import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, Send, Sparkles, User, ShieldCheck, RefreshCw, Info } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  provider?: string;
}

export const AiCreditAdvisorPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I am your RPAI Credit Intelligence Advisor.

I can explain your alternative credit score, score component breakdowns, cash-flow stability, or affordability analysis.

How can I assist your financial review today?`,
      provider: 'RPAI Credit Engine',
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('rpai_token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/credit/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text, applicationId: 'demo_app_001' }),
      });

      const json = await res.json();
      const aiAnswer = json.data?.answer || 'I could not generate an answer at this time.';

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiAnswer, provider: json.data?.provider || 'RPAI Credit Advisor' },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered an error. Please try again.', provider: 'System Error' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Why is my credit score 791?',
    'What is lowering my credit score?',
    'How can I improve my score?',
    'What alternative data sources were used?',
    'Explain my affordability analysis',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Credit Advisor</h1>
          </div>
          <p className="text-xs text-slate-500">Ask natural language questions about your alternative credit assessment.</p>
        </div>
      </div>

      <Card className="flex flex-col p-0 border-slate-200 shadow-lg overflow-hidden" style={{ height: '65vh' }}>
        {/* Messages feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-800 mt-0.5">
                  <Bot className="w-4.5 h-4.5" />
                </div>
              )}

              <div
                className={`max-w-2xl min-w-0 break-words rounded-xl p-4 shadow-xs text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.provider && (
                  <span className="text-[9px] font-mono text-slate-400 block mt-2 pt-2 border-t border-slate-100">
                    Source: {m.provider}
                  </span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <Bot className="w-4 h-4 animate-spin text-sky-500" /> Analyzing credit assessment...
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div className="p-3 border-t border-slate-100 bg-white flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about your credit score, factors, or affordability..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSend()}
            isLoading={loading}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
