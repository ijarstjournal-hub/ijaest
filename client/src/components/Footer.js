import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  const s = {
    footer: {
      background: '#0D0D0D',
      color: '#CCCCCC',
      fontFamily: 'var(--font-body)',
      borderTop: '4px solid #F5C400',
    },
    inner: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '56px 24px 32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 40,
    },
    colTitle: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#F5C400',
      marginBottom: 16,
      paddingBottom: 8,
      borderBottom: '1px solid #333',
    },
    brandName: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 800,
      color: '#F5C400',
      marginBottom: 6,
    },
    link: {
      display: 'block',
      color: '#AAAAAA',
      fontSize: 13.5,
      marginBottom: 8,
      textDecoration: 'none',
      transition: 'color 0.18s',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 10,
      fontSize: 13.5,
      color: '#AAAAAA',
    },
    bottom: {
      background: '#060606',
      borderTop: '1px solid #1a1a1a',
    },
    bottomInner: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      fontSize: 12.5,
      color: '#666',
    },
  };

  const linkHover = (e, over) => {
    e.currentTarget.style.color = over ? '#F5C400' : '#AAAAAA';
  };

  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        {/* Brand column */}
        <div>
          <div style={s.brandName}>IJARST</div>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>
            International Journal of Applied Research<br />in Science & Technology
          </p>
          <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>🇬🇧 United Kingdom</p>
          <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>ISSN: (pending registration)</p>
          <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>Open Access · Peer-Reviewed</p>
          <a
            href="/submit"
            style={{
              background: '#1B5E20', color: '#fff', padding: '9px 20px',
              borderRadius: 4, fontSize: 13, fontWeight: 700, textDecoration: 'none',
              display: 'inline-block', transition: 'background 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2E7D32'}
            onMouseLeave={e => e.currentTarget.style.background = '#1B5E20'}
          >
            Submit Your Paper →
          </a>
        </div>

        {/* Quick links */}
        <div>
          <div style={s.colTitle}>Quick Links</div>
          {[
            { label: 'Home', to: '/' },
            { label: 'Browse Issues', to: '/issues' },
            { label: 'Submit Paper', to: '/submit' },
            { label: 'Publication Fees', to: '/fees' },
            { label: 'Indexing', to: '/indexing' },
            { label: 'Editorial Board', to: '/editorial-board' },
            { label: 'Aims & Scope', to: '/aims-scope' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={s.link}
              onMouseEnter={e => linkHover(e, true)}
              onMouseLeave={e => linkHover(e, false)}>
              › {l.label}
            </Link>
          ))}
        </div>

        {/* Publication Ethics */}
        <div>
          <div style={s.colTitle}>Publication Ethics</div>
          {[
            { label: 'Open Access Policy', to: '/open-access-policy' },
            { label: 'Peer Review Policy', to: '/peer-review-policy' },
            { label: 'Plagiarism Policy', to: '/plagiarism-policy' },
            { label: "Authors' Guide", to: '/authors-guide' },
            { label: 'Contact Us', to: '/contact' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={s.link}
              onMouseEnter={e => linkHover(e, true)}
              onMouseLeave={e => linkHover(e, false)}>
              › {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={s.colTitle}>Contact</div>
          <div style={s.contactItem}>
            <span>✉️</span>
            <a href="mailto:ijarstjournal@gmail.com" style={{ color: '#AAAAAA', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F5C400'}
              onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}>
              ijarstjournal@gmail.com
            </a>
          </div>
          <div style={s.contactItem}>
            <span>💬</span>
            <a href="https://wa.me/447479811823" target="_blank" rel="noreferrer"
              style={{ color: '#AAAAAA', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#25D366'}
              onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}>
              +44 7479 811823
            </a>
          </div>
          <div style={s.contactItem}>
            <span>🌐</span>
            <a href="https://ijarst.uk" style={{ color: '#AAAAAA', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F5C400'}
              onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}>
              www.ijarst.uk
            </a>
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#1a1a1a', borderRadius: 6, borderLeft: '3px solid #F5C400' }}>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
              <strong style={{ color: '#F5C400' }}>APC: $33 USD</strong><br />
              Payable only after acceptance.<br />No upfront charges.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={s.bottom}>
        <div style={s.bottomInner}>
          <span>© {year} IJARST – International Journal of Applied Research in Science & Technology. All rights reserved.</span>
          <span style={{ color: '#444' }}>ISSN: Pending · Open Access · UK 🇬🇧</span>
        </div>
      </div>
    </footer>
  );
}
