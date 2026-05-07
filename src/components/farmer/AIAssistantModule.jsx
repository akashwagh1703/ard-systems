import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RefreshCw, User, Sparkles } from 'lucide-react';
import { required, maxLength } from '../../utils/farmerValidations';

const SUGGESTIONS = [
  'What is the best feed for my cow?',
  'How to increase milk production?',
  'Signs of FMD disease in cattle?',
  'When should I vaccinate my animals?',
  'How to treat mastitis in cows?',
];

const AI_RESPONSES = {
  default: "I'm your AI farming assistant. I can help with animal health, milk production, breeding, and more. Please ask your question!",
  feed: "For dairy cows, provide a balanced diet: 60% roughage (green fodder, hay) and 40% concentrate feed. Ensure clean water is always available. For HF cows producing 15+ litres, give 1 kg concentrate per 2.5 litres of milk.",
  milk: "To increase milk production: 1) Ensure proper nutrition with balanced feed, 2) Maintain regular milking schedule (2-3 times daily), 3) Keep animals stress-free, 4) Ensure adequate water intake (50-80 litres/day), 5) Regular health checkups.",
  fmd: "FMD (Foot and Mouth Disease) signs: fever, blisters on mouth/feet/teats, excessive salivation, lameness, reduced milk production. Isolate affected animals immediately and contact your veterinarian. Vaccination is the best prevention.",
  vaccin: "Vaccination schedule: FMD — every 6 months, HS (Hemorrhagic Septicemia) — annually before monsoon, BQ (Black Quarter) — annually, Brucellosis — once for calves 4-8 months. Contact your local veterinary officer for the schedule.",
  mastitis: "Mastitis treatment: 1) Strip affected quarter 3-4 times daily, 2) Apply warm compress, 3) Consult vet for antibiotic treatment, 4) Maintain udder hygiene, 5) Discard milk from affected quarter during treatment. Prevention: clean milking practices.",
};

const getResponse = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('feed') || lower.includes('fodder') || lower.includes('diet')) return AI_RESPONSES.feed;
  if (lower.includes('milk') || lower.includes('production') || lower.includes('litre')) return AI_RESPONSES.milk;
  if (lower.includes('fmd') || lower.includes('foot') || lower.includes('mouth')) return AI_RESPONSES.fmd;
  if (lower.includes('vaccin')) return AI_RESPONSES.vaccin;
  if (lower.includes('mastitis') || lower.includes('udder')) return AI_RESPONSES.mastitis;
  return `Thank you for your question about "${msg}". Based on best farming practices, I recommend consulting your local veterinary officer for specific advice. Generally, maintaining proper nutrition, hygiene, and regular health checkups are key to healthy livestock.`;
};

export default function AIAssistantModule() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: AI_RESPONSES.default, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input;
    const err = required(msg, 'Message') || maxLength(msg, 2000, 'Message');
    if (err) { setError(err); return; }
    setError('');
    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    const aiMsg = { id: Date.now() + 1, role: 'ai', text: getResponse(msg), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(p => [...p, aiMsg]);
    setLoading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); send(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: 500 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Livestock Decision Support Assistant</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', animation: 'dotPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>Online · AI-Simulated Advisory Support</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.role === 'ai' ? 'linear-gradient(135deg, var(--orange), var(--orange-dark))' : 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'ai' ? <Bot size={15} color="#fff" /> : <User size={15} color="#fff" />}
            </div>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role === 'user' ? 'var(--blue)' : 'var(--surface)', border: m.role === 'ai' ? '1px solid var(--border)' : 'none', boxShadow: 'var(--shadow-xs)' }}>
                <p style={{ fontSize: 14, color: m.role === 'user' ? '#fff' : 'var(--text-1)', lineHeight: 1.6, margin: 0 }}>{m.text}</p>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4, textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={15} color="#fff" />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-4)', animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles size={13} color="var(--orange)" /> Suggested questions
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ padding: '6px 12px', borderRadius: 'var(--r-full)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about animal health, milk production, breeding... (max 2000 chars)"
              rows={2}
              maxLength={2000}
              style={{ width: '100%', padding: '11px 14px', fontSize: 14, border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-xl)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none', lineHeight: 1.5 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {error ? <p style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</p> : <span />}
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{input.length}/2000</span>
            </div>
          </div>
          <button type="submit" disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: '50%', background: input.trim() ? 'var(--orange)' : 'var(--base-3)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s ease', boxShadow: input.trim() ? '0 4px 16px rgba(249,115,22,0.30)' : 'none', marginBottom: 24 }}>
            {loading ? <RefreshCw size={18} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} color={input.trim() ? '#fff' : 'var(--text-4)'} />}
          </button>
        </form>
      </div>
    </div>
  );
}
