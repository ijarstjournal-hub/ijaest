import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Issues', to: '/issues' },
  { label: 'Publication Fees', to: '/fees' },
  { label: 'Indexing', to: '/indexing' },
  { label: 'Editorial Team', to: '/editorial-board' },
];

const ETHICS_LINKS = [
  { label: 'Open Access Policy', to: '/open-access-policy' },
  { label: 'Peer Review Policy', to: '/peer-review-policy' },
  { label: 'Plagiarism Policy', to: '/plagiarism-policy' },
  { label: "Authors' Guide", to: '/authors-guide' },
  { label: 'Aims & Scope', to: '/aims-scope' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileEthicsOpen, setMobileEthicsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setMobileEthicsOpen(false);
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to;

  const styles = {
    topBar: {
      background: '#F5C400',
      overflow: 'hidden',
      height: 36,
      display: 'flex',
      alignItems: 'center',
    },
    marqueeOuter: {
      overflow: 'hidden',
      flex: 1,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    marqueeTrack: {
      display: 'flex',
      whiteSpace: 'nowrap',
      animation: 'marquee 32s linear infinite',
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-body)',
      color: '#0D0D0D',
      gap: 60,
      alignItems: 'center',
    },
    nav: {
      background: '#0D0D0D',
      borderBottom: '1px solid #222',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navInner: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
    },
    brand: {
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
    },
    brandName: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 800,
      color: '#F5C400',
      letterSpacing: '-0.02em',
      lineHeight: 1,
    },
    brandSub: {
      fontSize: 10,
      color: '#888',
      fontFamily: 'var(--font-body)',
      fontWeight: 400,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginTop: 2,
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      listStyle: 'none',
    },
    link: (active) => ({
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      color: active ? '#F5C400' : '#CCCCCC',
      padding: '8px 12px',
      borderRadius: 4,
      textDecoration: 'none',
      transition: 'all 0.18s',
      background: active ? 'rgba(245,196,0,0.08)' : 'transparent',
      display: 'block',
    }),
    dropdownBtn: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      color: dropdownOpen ? '#F5C400' : '#CCCCCC',
      padding: '8px 12px',
      borderRadius: 4,
      background: dropdownOpen ? 'rgba(245,196,0,0.08)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: 6,
      minWidth: 220,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      zIndex: 200,
      overflow: 'hidden',
    },
    dropdownItem: {
      display: 'block',
      padding: '10px 16px',
      fontSize: 13.5,
      fontWeight: 500,
      color: '#CCCCCC',
      textDecoration: 'none',
      transition: 'background 0.15s',
      fontFamily: 'var(--font-body)',
    },
    hamburger: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    },
    bar: {
      width: 24,
      height: 2,
      background: '#FAFAFA',
      borderRadius: 2,
      transition: 'all 0.18s',
    },
    mobileMenu: {
      background: '#111',
      borderTop: '1px solid #222',
      padding: '8px 0 16px',
    },
    mobileLink: {
      display: 'block',
      padding: '11px 24px',
      fontSize: 15,
      fontWeight: 600,
      color: '#CCCCCC',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
    },
    mobileEthicsBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '11px 24px',
      fontSize: 15,
      fontWeight: 600,
      color: '#CCCCCC',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
    },
    mobileSubLink: {
      display: 'block',
      padding: '9px 36px',
      fontSize: 14,
      color: '#888',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
    },
    submitBtn: {
      background: '#1B5E20',
      color: '#fff',
      padding: '7px 16px',
      borderRadius: 4,
      fontSize: 13.5,
      fontWeight: 700,
      textDecoration: 'none',
      marginLeft: 8,
      fontFamily: 'var(--font-body)',
      transition: 'background 0.18s',
    },
  };

  const marqueeContent = (
    <>
      <span>📞 WhatsApp: +44 7479 811823</span>
      <span style={{ color: '#1B5E20', fontWeight: 900 }}>✦</span>
      <span>✉️ ijarstjournal@gmail.com</span>
      <span style={{ color: '#1B5E20', fontWeight: 900 }}>✦</span>
      <span>⚡ Fast Publication | Open Access | Peer-Reviewed</span>
      <span style={{ color: '#1B5E20', fontWeight: 900 }}>✦</span>
      <span>💰 APC: $33 USD — Payable Only After Acceptance</span>
      <span style={{ color: '#1B5E20', fontWeight: 900 }}>✦</span>
      <span>🇬🇧 International Journal of Applied Research in Science & Technology</span>
      <span style={{ color: '#1B5E20', fontWeight: 900 }}>✦</span>
    </>
  );

  return (
    <header>
      {/* Yellow marquee top bar */}
      <div style={styles.topBar}>
        <div style={styles.marqueeOuter}>
          <div className="marquee-track">
            {marqueeContent}
            {marqueeContent}
          </div>
        </div>
      </div>

      {/* Main dark navbar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {/* Brand */}
          <Link to="/" style={styles.brand}>
            <span style={styles.brandName}>IJARST</span>
            <span style={styles.brandSub}>Int. Journal · Applied Research · S&T</span>
          </Link>

          {/* Desktop links */}
          <ul style={styles.links} className="hide-mobile">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} style={styles.link(isActive(l.to))}
                  onMouseEnter={e => { if (!isActive(l.to)) e.currentTarget.style.color = '#F5C400'; }}
                  onMouseLeave={e => { if (!isActive(l.to)) e.currentTarget.style.color = '#CCCCCC'; }}>
                  {l.label}
                </Link>
              </li>
            ))}

            {/* Publication Ethics dropdown */}
            <li style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                style={styles.dropdownBtn}
                onClick={() => setDropdownOpen((p) => !p)}
                onMouseEnter={e => e.currentTarget.style.color = '#F5C400'}
                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.color = '#CCCCCC'; }}
              >
                Publication Ethics
                <span style={{ fontSize: 10, transition: 'transform 0.18s', display: 'inline-block', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  {ETHICS_LINKS.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      style={styles.dropdownItem}
                      onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#F5C400'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CCCCCC'; }}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <a href="/submit" style={styles.submitBtn}
                onMouseEnter={e => e.currentTarget.style.background = '#2E7D32'}
                onMouseLeave={e => e.currentTarget.style.background = '#1B5E20'}>
                Submit Paper
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            style={styles.hamburger}
            className="hide-desktop"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span style={{ ...styles.bar, transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ ...styles.bar, opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ ...styles.bar, transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={styles.mobileMenu} className="hide-desktop">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} style={{ ...styles.mobileLink, color: isActive(l.to) ? '#F5C400' : '#CCCCCC' }}>
                {l.label}
              </Link>
            ))}
            <button style={styles.mobileEthicsBtn} onClick={() => setMobileEthicsOpen((p) => !p)}>
              <span>Publication Ethics</span>
              <span style={{ fontSize: 11 }}>{mobileEthicsOpen ? '▲' : '▼'}</span>
            </button>
            {mobileEthicsOpen && ETHICS_LINKS.map((l) => (
              <Link key={l.to} to={l.to} style={styles.mobileSubLink}>{l.label}</Link>
            ))}
            <Link to="/submit" style={{ ...styles.mobileLink, color: '#F5C400' }}>Submit Paper →</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
