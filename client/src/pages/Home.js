import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PaperCard from '../components/PaperCard';

export default function Home() {
  const [latestPapers, setLatestPapers] = useState([]);
  const [mostViewed, setMostViewed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/papers').catch(() => ({ data: [] })),
      axios.get('/api/papers/most-viewed').catch(() => ({ data: null })),
    ]).then(([papersRes, mvRes]) => {
      setLatestPapers((papersRes.data || []).slice(0, 3));
      setMostViewed(mvRes.data || null);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,#0D0D0D 0%,#1a1a1a 60%,#0f2010 100%)', color: '#FAFAFA', padding: '80px 0 70px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#F5C400' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,#F5C400 40px,#F5C400 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#F5C400 40px,#F5C400 41px)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,196,0,0.12)', border: '1px solid rgba(245,196,0,0.3)', color: '#F5C400', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 24 }}>
            🇬🇧  Open Access · Peer-Reviewed · UK Based
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,7vw,72px)', fontWeight: 800, color: '#FAFAFA', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 12 }}>IJARST</h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,2.5vw,20px)', fontWeight: 400, fontStyle: 'italic', color: '#AAAAAA', marginBottom: 28 }}>
            International Journal of Applied Research in Science & Technology
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(27,94,32,0.2)', border: '1px solid rgba(46,125,50,0.4)', borderRadius: 8, padding: '12px 20px', marginBottom: 36 }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#4CAF50' }}>APC: $33 USD</div>
              <div style={{ fontSize: 12, color: '#888' }}>Payable only after acceptance — no upfront charges</div>
            </div>
          </div>
          <br />
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
            <Link to="/submit" className="btn btn-yellow">Submit Your Paper →</Link>
            <Link to="/issues" className="btn btn-outline" style={{ color: '#FAFAFA', borderColor: '#FAFAFA' }}>Browse Issues</Link>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[{ n: '$33', label: 'Article Processing Charge' }, { n: '🇬🇧', label: 'UK Registered Journal' }, { n: '72h', label: 'Avg. Review Turnaround' }, { n: '∞', label: 'Open Access Forever' }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#F5C400' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope */}
      <section style={{ padding: '72px 0', background: '#F7F7F7' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="section-badge">Scope & Aims</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#0D0D0D', marginBottom: 16 }}>Advancing Global Research</h2>
              <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.75, marginBottom: 20 }}>IJARST is a fully open-access, peer-reviewed journal dedicated to publishing high-quality original research across engineering, applied sciences, and emerging technologies.</p>
              <Link to="/aims-scope" className="btn btn-outline">Read Full Scope</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['⚙️','Engineering & Technology'],['🔬','Applied Sciences'],['💻','Computer Science & AI'],['🌱','Environmental Sciences'],['⚡','Electrical & Electronics'],['🏗️','Civil Engineering'],['🧪','Materials Science'],['📡','Communications & IoT']].map(([icon, label]) => (
                <div key={label} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Publications */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <span className="section-badge">Latest Publications</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#0D0D0D', marginBottom: 8 }}>Recent Articles</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 36 }}>Browse the most recently published papers in IJARST.</p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><span className="spinner" /></div>
          ) : latestPapers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {latestPapers.map(p => <PaperCard key={p._id} paper={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#888', background: '#F7F7F7', borderRadius: 8 }}>
              <p style={{ fontSize: 16 }}>No published papers yet. Be the first to submit!</p>
              <Link to="/submit" className="btn btn-primary" style={{ marginTop: 20 }}>Submit Now</Link>
            </div>
          )}
          {latestPapers.length > 0 && <div style={{ textAlign: 'center', marginTop: 36 }}><Link to="/issues" className="btn btn-outline">View All Issues →</Link></div>}
        </div>
      </section>

      {/* Most Viewed */}
      {mostViewed && (
        <section style={{ padding: '72px 0', background: '#F7F7F7' }}>
          <div className="container">
            <span className="section-badge">Trending</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#0D0D0D', marginBottom: 24 }}>Most Viewed Paper</h2>
            <PaperCard paper={mostViewed} />
          </div>
        </section>
      )}

      {/* Editorial Policy */}
      <section style={{ padding: '72px 0', background: mostViewed ? '#fff' : '#F7F7F7' }}>
        <div className="container">
          <span className="section-badge">Publication Standards</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#0D0D0D', marginBottom: 32 }}>Our Editorial Commitments</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {[['🔍','Double-Blind Peer Review','All submissions undergo rigorous double-blind peer review by domain experts.'],['✅','Originality Check','Comprehensive plagiarism screening on every manuscript before review.'],['🔓','Open Access','All published articles are immediately freely available worldwide.'],['⚖️','Publication Ethics','Strict COPE guidelines followed for all editorial decisions.']].map(([icon, title, desc]) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '28px 24px', textAlign: 'center', borderTop: '3px solid #1B5E20', transition: 'all 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#1B5E20 0%,#2E7D32 100%)', padding: '72px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>Submit Your Research Today</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>Fast review, open access, affordable APC of just $33 — charged only after acceptance.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/submit" className="btn btn-yellow">Submit via Email →</Link>
            <Link to="/fees" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>View Fee Details</Link>
          </div>
        </div>
      </section>
    </>
  );
}
