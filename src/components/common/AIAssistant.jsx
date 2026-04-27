import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processNLPQuery, getRecommendations } from '../../services/aiEngine';
import {
  MessageSquare, X, Send, Bot, User, Sparkles,
  ArrowRight, Lightbulb, Mic, RotateCcw, ChevronDown
} from 'lucide-react';

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high:     'bg-orange-100 text-orange-800 border-orange-200',
  medium:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  low:      'bg-blue-100 text-blue-800 border-blue-200',
};

const QUICK_PROMPTS = [
  'What is the current stock status?',
  'Any disease outbreak alerts?',
  'Show budget anomalies',
  'MVU coverage status',
  'Pending grievances summary',
];

const TypingIndicator = ({ isDark }) => (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-purple-500/30' : 'bg-purple-100'}`}>
      <Bot className={`h-4 w-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
    </div>
    <div className={`flex gap-1 px-3 py-2 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
      {[0, 1, 2].map(i => (
        <div key={i} className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </div>
  </div>
);

const AIAssistant = ({ isDark = false, serviceData = {}, userRole = 'super_admin' }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'recommendations'
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      text: 'Hello! I\'m your ARD AI Assistant. I can help you with stock levels, disease alerts, budget analysis, MVU tracking, and more. What would you like to know?',
      timestamp: new Date().toISOString(),
      suggestions: QUICK_PROMPTS.slice(0, 3),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const recommendations = getRecommendations({ role: userRole, serviceData, currentModule: 'dashboard' });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const sendMessage = async (text) => {
    const query = text || input.trim();
    if (!query) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: query, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const result = processNLPQuery(query);
    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: result.response,
      intent: result.intent,
      confidence: result.confidence,
      action: result.action,
      route: result.route,
      suggestions: result.suggestions,
      timestamp: result.timestamp,
    };

    setTyping(false);
    setMessages(prev => [...prev, aiMsg]);
    if (!open) setUnread(u => u + 1);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages(prev => [prev[0]]);

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="AI Assistant"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <Sparkles className="h-6 w-6 text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-96 rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
        }`} style={{ height: '560px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">ARD AI Assistant</p>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-purple-200 text-xs">Online • Powered by AI Engine</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center" title="Clear chat">
                  <RotateCcw className="h-3.5 w-3.5 text-white" />
                </button>
                <button onClick={() => setOpen(false)} className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center">
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-3">
              {[
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'recommendations', label: `Insights (${recommendations.length})`, icon: Lightbulb },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tab === t.id ? 'bg-white text-purple-700' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CHAT TAB ── */}
          {tab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
                {messages.map(msg => (
                  <div key={msg.id}>
                    <div className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        msg.role === 'user'
                          ? 'bg-blue-500'
                          : isDark ? 'bg-purple-500/30' : 'bg-purple-100'
                      }`}>
                        {msg.role === 'user'
                          ? <User className="h-4 w-4 text-white" />
                          : <Bot className={`h-4 w-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                        }
                      </div>
                      <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white rounded-tr-sm'
                            : isDark ? 'bg-white/10 text-gray-100 rounded-tl-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>

                        {/* Confidence badge */}
                        {msg.confidence && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            {msg.confidence}% confidence
                          </span>
                        )}

                        {/* Action button */}
                        {msg.action && msg.route && (
                          <button
                            onClick={() => { navigate(msg.route); setOpen(false); }}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {msg.action} <ArrowRight className="h-3 w-3" />
                          </button>
                        )}

                        {/* Suggestions */}
                        {msg.suggestions?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.suggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => sendMessage(s)}
                                className={`text-xs px-2 py-1 rounded-full border transition-all hover:scale-105 ${
                                  isDark ? 'border-white/20 text-gray-300 hover:bg-white/10' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {typing && <TypingIndicator isDark={isDark} />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts */}
              <div className={`px-3 py-2 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(p)}
                      className={`text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap border shrink-0 transition-all hover:scale-105 ${
                        isDark ? 'border-white/20 text-gray-300 hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className={`p-3 border-t shrink-0 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about stock, disease, budget..."
                    className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className="h-7 w-7 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Send className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── RECOMMENDATIONS TAB ── */}
          {tab === 'recommendations' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                AI-Generated Insights & Actions
              </p>
              {recommendations.map(rec => (
                <div key={rec.id} className={`rounded-xl border p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{rec.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 font-medium ${PRIORITY_COLORS[rec.priority]}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className={`h-1.5 w-1.5 rounded-full ${rec.confidence >= 85 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{rec.confidence}% confidence</span>
                    </div>
                    {rec.route && (
                      <button
                        onClick={() => { navigate(rec.route); setOpen(false); }}
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        {rec.action} <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className={`text-xs mt-2 italic ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Impact: {rec.impact}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
