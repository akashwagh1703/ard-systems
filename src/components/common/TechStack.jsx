import React, { useState } from 'react';
import { ContentCard, SectionHeader } from './ServiceWidgets';
import { Cpu, Globe, Database, Shield, Zap, Brain, Server, Code, Cloud, GitBranch, Monitor, Layers } from 'lucide-react';

const STACK = [
  {
    category: 'Frontend', icon: Monitor, color: 'var(--blue)',
    items: [
      { name: 'React 18',        desc: 'Component-based UI framework',         badge: 'Core'      },
      { name: 'Vite 4',          desc: 'Lightning-fast build tool',             badge: 'Build'     },
      { name: 'React Router 6',  desc: 'Client-side routing & navigation',      badge: 'Routing'   },
      { name: 'Tailwind CSS 3',  desc: 'Utility-first CSS framework',           badge: 'Styling'   },
      { name: 'Lucide React',    desc: 'Consistent icon library',               badge: 'Icons'     },
      { name: 'CSS Variables',   desc: '2026 design system tokens',             badge: 'Design'    },
    ],
  },
  {
    category: 'AI / ML Stack', icon: Brain, color: '#7C3AED',
    items: [
      { name: 'TensorFlow',      desc: 'Deep learning models',                  badge: 'ML'        },
      { name: 'Scikit-learn',    desc: 'Classical ML algorithms',               badge: 'ML'        },
      { name: 'Prophet',         desc: 'Time-series demand forecasting',        badge: 'Forecast'  },
      { name: 'XGBoost',         desc: 'Gradient boosting for anomaly detect',  badge: 'Anomaly'   },
      { name: 'spaCy / BERT',    desc: 'NLP & sentiment analysis',              badge: 'NLP'       },
      { name: 'GeoPandas / H3',  desc: 'Geospatial AI & hexagonal indexing',   badge: 'Geo AI'    },
    ],
  },
  {
    category: 'Backend Services', icon: Server, color: 'var(--success)',
    items: [
      { name: 'Node.js + Express', desc: 'REST API microservices',              badge: 'API'       },
      { name: 'Python FastAPI',    desc: 'AI/ML service endpoints',             badge: 'Python'    },
      { name: 'Apache Kafka',      desc: 'Event streaming & messaging',         badge: 'Events'    },
      { name: 'RabbitMQ',          desc: 'Task queuing & async processing',     badge: 'Queue'     },
      { name: 'Redis',             desc: 'Caching & session management',        badge: 'Cache'     },
    ],
  },
  {
    category: 'Databases', icon: Database, color: 'var(--warning)',
    items: [
      { name: 'PostgreSQL',      desc: 'Primary relational database',           badge: 'RDBMS'     },
      { name: 'MongoDB',         desc: 'Document storage for reports',          badge: 'NoSQL'     },
      { name: 'TimescaleDB',     desc: 'Time-series IoT sensor data',           badge: 'Time-series'},
      { name: 'Redis',           desc: 'In-memory caching layer',               badge: 'Cache'     },
    ],
  },
  {
    category: '3rd Party Integrations', icon: Globe, color: 'var(--info)',
    items: [
      { name: 'DigiLocker',      desc: 'Farmer KYC & document verification',   badge: 'Gov'       },
      { name: 'UIDAI Aadhaar',   desc: 'Aadhaar OTP authentication',           badge: 'Gov'       },
      { name: 'BBPS / UPI',      desc: 'Payment gateway integration',          badge: 'Payment'   },
      { name: 'NIC SMS Gateway', desc: 'OTP & alert notifications',            badge: 'Messaging' },
      { name: 'Google Maps API', desc: 'MVU tracking & route optimization',    badge: 'Geo'       },
      { name: 'IMD Weather API', desc: 'Disease risk correlation',             badge: 'Data'      },
      { name: 'ICAR-NIVEDI',     desc: 'Lab results via HL7 FHIR',            badge: 'Lab'       },
      { name: 'GeM Portal',      desc: 'Government e-marketplace procurement', badge: 'Gov'       },
      { name: 'e-Office NIC',    desc: 'Approval workflow integration',        badge: 'Gov'       },
      { name: 'WhatsApp Business',desc: 'Farmer notifications',               badge: 'Messaging' },
    ],
  },
  {
    category: 'DevOps & Infrastructure', icon: Cloud, color: 'var(--orange)',
    items: [
      { name: 'Docker',          desc: 'Container runtime',                    badge: 'Container' },
      { name: 'Kubernetes',      desc: 'Container orchestration',              badge: 'Orchestration'},
      { name: 'GitHub Actions',  desc: 'CI/CD automated pipelines',            badge: 'CI/CD'     },
      { name: 'Prometheus',      desc: 'Metrics collection & alerting',        badge: 'Monitoring'},
      { name: 'Grafana',         desc: 'Dashboard visualization',              badge: 'Monitoring'},
    ],
  },
  {
    category: 'Security', icon: Shield, color: 'var(--danger)',
    items: [
      { name: 'OAuth 2.0 + SAML',desc: 'SSO & federation protocols',          badge: 'Auth'      },
      { name: 'SonarQube',       desc: 'Code quality & security scanning',     badge: 'SAST'      },
      { name: 'OWASP ZAP',       desc: 'Vulnerability scanning',               badge: 'Security'  },
    ],
  },
];

const STATS = [
  { label: 'Microservices',    value: '10',  icon: Layers,     color: 'var(--blue)'    },
  { label: 'API Integrations', value: '15',  icon: Globe,      color: 'var(--success)' },
  { label: 'AI/ML Models',     value: '9',   icon: Brain,      color: '#7C3AED'        },
  { label: 'User Roles',       value: '5',   icon: Shield,     color: 'var(--warning)' },
  { label: 'Report Templates', value: '12',  icon: Monitor,    color: 'var(--orange)'  },
  { label: 'Tech Components',  value: '35+', icon: Cpu,        color: 'var(--info)'    },
];

const BADGE_COLORS = {
  Core: 'var(--blue)', Build: 'var(--blue)', Routing: 'var(--blue)', Styling: 'var(--blue)',
  Icons: 'var(--text-3)', Design: 'var(--orange)',
  ML: '#7C3AED', Forecast: '#7C3AED', Anomaly: '#7C3AED', NLP: '#7C3AED', 'Geo AI': '#7C3AED',
  API: 'var(--success)', Python: 'var(--success)',
  Events: 'var(--warning)', Queue: 'var(--warning)', Cache: 'var(--warning)',
  RDBMS: 'var(--info)', NoSQL: 'var(--info)', 'Time-series': 'var(--info)',
  Gov: 'var(--blue)', Payment: 'var(--success)', Messaging: 'var(--orange)',
  Geo: 'var(--danger)', Data: 'var(--info)', Lab: '#7C3AED',
  Container: 'var(--orange)', Orchestration: 'var(--orange)', 'CI/CD': 'var(--orange)',
  Monitoring: 'var(--success)',
  Auth: 'var(--danger)', SAST: 'var(--danger)', Security: 'var(--danger)',
};

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? STACK : STACK.filter(s => s.category === activeCategory);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeUp 0.4s ease forwards' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 40%, #2563EB 70%, #3B82F6 100%)',
        borderRadius: 'var(--r-2xl)', padding: '2rem 2.5rem', marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 120, width: 140, height: 140, borderRadius: '50%', background: 'rgba(249,115,22,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu className="icon-lg" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Tools & Technology Stack</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>Enterprise-grade architecture powering the ARD platform</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ padding: '10px', borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
                  <Icon className="icon-sm" style={{ color: '#FCD34D', margin: '0 auto 4px' }} />
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</p>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {['all', ...STACK.map(s => s.category)].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '5px 12px', borderRadius: 'var(--r-md)', fontSize: 11, fontWeight: 500,
            background: activeCategory === cat ? 'var(--blue)' : 'var(--surface)',
            color: activeCategory === cat ? '#fff' : 'var(--text-3)',
            border: `1px solid ${activeCategory === cat ? 'var(--blue)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Stack grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {filtered.map((section, si) => {
          const Icon = section.icon;
          return (
            <ContentCard key={si}>
              <SectionHeader title={section.category} icon={Icon} color={section.color}
                right={<span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: section.color + '15', color: section.color, border: `1px solid ${section.color}30` }}>{section.items.length} tools</span>}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map((item, ii) => {
                  const badgeColor = BADGE_COLORS[item.badge] || 'var(--text-3)';
                  return (
                    <div key={ii} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 'var(--r-lg)',
                      background: 'var(--base-2)', border: '1px solid var(--border)',
                      transition: 'all 0.15s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = section.color + '40'; e.currentTarget.style.background = section.color + '08'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--base-2)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{item.name}</p>
                          <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 1 }}>{item.desc}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--r-full)',
                        background: badgeColor + '15', color: badgeColor,
                        border: `1px solid ${badgeColor}30`,
                        textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                      }}>{item.badge}</span>
                    </div>
                  );
                })}
              </div>
            </ContentCard>
          );
        })}
      </div>
    </div>
  );
}
