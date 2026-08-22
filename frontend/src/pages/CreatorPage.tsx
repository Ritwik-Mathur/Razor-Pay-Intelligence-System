import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Globe,
  ArrowLeft,
  Code2,
  Layers,
  Cpu,
  Database,
  Shield,
  Zap,
  Star,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Award,
  Sparkles,
} from 'lucide-react';

const techStack = [
  { label: 'React + TypeScript', category: 'Frontend', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'Vite', category: 'Frontend', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'TailwindCSS', category: 'Frontend', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'Node.js + Express', category: 'Backend', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'TypeScript', category: 'Backend', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'MongoDB + Mongoose', category: 'Database', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Razorpay SDK', category: 'Payments', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { label: 'JWT Auth', category: 'Security', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'bcrypt', category: 'Security', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'AI / LLM Integration', category: 'AI', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Zod Validation', category: 'Backend', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Fraud Detection Engine', category: 'AI', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

const highlights = [
  { icon: Layers, label: 'Full Stack Platform', desc: 'End-to-end fintech solution from UI to DB' },
  { icon: Cpu, label: 'AI Payment Agent', desc: 'Live Razorpay checkout automation with real SDK' },
  { icon: Shield, label: 'Fraud Detection', desc: 'Risk scoring engine with real-time evaluation' },
  { icon: Database, label: 'Credit Intelligence', desc: 'Credit assessment, risk profiling & loan simulation' },
  { icon: Zap, label: 'Real-time Operations', desc: 'Live transaction ledger, audit logs & reconciliation' },
  { icon: Code2, label: 'Clean Architecture', desc: 'TypeScript, MVC pattern, modular controllers' },
];

const links = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'ritwikmathur',
    url: 'https://www.linkedin.com/in/ritwikmathur/',
    icon: Linkedin,
    bg: 'bg-[#0A66C2]',
    hover: 'hover:bg-[#004182]',
    desc: 'Professional profile & experience',
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: 'Ritwik-Mathur',
    url: 'https://github.com/Ritwik-Mathur',
    icon: Github,
    bg: 'bg-slate-800',
    hover: 'hover:bg-slate-900',
    desc: 'Open source projects & code',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    handle: 'ritwik-mathur-portfolio.netlify.app',
    url: 'https://ritwik-mathur-portfolio.netlify.app/',
    icon: Globe,
    bg: 'bg-indigo-600',
    hover: 'hover:bg-indigo-700',
    desc: 'Personal website & works',
  },
];

export const CreatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f0fdf4 100%)',
      }}
    >
      {/* ── Top Nav Bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">RPAI Platform</span>
          </div>
          <a
            href="mailto:ritwik@example.com"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Mail size={13} />
            Contact
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* ── Hero Card ── */}
        <div
          className={`bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Cover gradient strip */}
          <div
            className="h-36 w-full relative"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #0ea5e9 100%)',
            }}
          >
            {/* Decorative circuit lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-4 right-6 flex items-center gap-2">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Creator</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-white" style={{ borderRadius: '100% 100% 0 0 / 50px 50px 0 0' }} />
          </div>

          <div className="px-8 pb-10 -mt-16 relative">
            {/* Avatar */}
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                  <img
                    src="/ritwik-mathur.png"
                    alt="Ritwik Mathur"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-50">
                      <span className="text-4xl font-black text-indigo-300">R</span>
                    </div>
                  )}
                </div>
                {/* Online badge */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <Star size={8} className="text-white fill-white" />
                </div>
              </div>

              {/* Quick social links top-right */}
              <div className="flex items-center gap-2 pb-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-sm ${link.bg} ${link.hover} hover:shadow-md hover:-translate-y-0.5`}
                      title={link.label}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Name & title */}
            <div className="mt-5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ritwik Mathur</h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                  Creator
                </span>
              </div>
              <p className="text-base font-semibold text-indigo-600 mt-1">
                Full Stack Developer · Fintech Builder · AI Enthusiast
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={11} /> India</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> Built in 2026</span>
                <span className="flex items-center gap-1"><Award size={11} /> RPAI Platform Author</span>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-5 text-sm text-slate-600 leading-relaxed max-w-2xl">
              Designed and engineered <strong className="text-slate-800">RPAI</strong> — a comprehensive AI-powered financial operations platform
              featuring live Razorpay payment processing, intelligent fraud detection, credit intelligence, multi-agent automation,
              and a full merchant dashboard. Built from scratch with a modern full-stack architecture and a focus on real-world fintech
              operations.
            </p>
          </div>
        </div>

        {/* ── Platform Highlights ── */}
        <div className={`mt-8 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">What was built</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                    <Icon size={18} className="text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{h.label}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className={`mt-8 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Tech Stack</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${tech.color}`}
                >
                  {tech.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Connect Links ── */}
        <div className={`mt-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Connect with Ritwik</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-5 rounded-2xl text-white shadow-sm ${link.bg} ${link.hover} hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{link.label}</p>
                    <p className="text-xs opacity-75 truncate">{link.desc}</p>
                    <p className="text-xs opacity-60 truncate mt-0.5 font-mono">@{link.handle}</p>
                  </div>
                  <ExternalLink size={14} className="ml-auto opacity-60 group-hover:opacity-100 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={`mt-12 text-center transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs text-slate-400">
            Built with ❤️ by{' '}
            <a href="https://www.linkedin.com/in/ritwikmathur/" target="_blank" rel="noopener noreferrer"
               className="font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
              Ritwik Mathur
            </a>
            {' '}· RPAI © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
