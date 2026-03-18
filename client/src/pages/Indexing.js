import React from 'react';

const databases = [
  { icon: '🎓', name: 'Google Scholar', desc: 'Papers are indexed by Google Scholar, making them discoverable by millions of researchers worldwide through Google search.' },
  { icon: '🔗', name: 'CrossRef / DOI', desc: 'Every accepted paper receives a unique CrossRef Digital Object Identifier (DOI) for permanent citation and reference linking.' },
  { icon: '📋', name: 'ROAD / ISSN', desc: 'IJARST is registered with the ISSN International Centre and listed in the ROAD directory of open access scholarly resources.' },
  { icon: '📚', name: 'ResearchBib', desc: 'All articles are submitted to ResearchBib, a comprehensive academic database for indexed open-access journals.' },
  { icon: '📊', name: 'SJIF', desc: 'Scientific Journal Impact Factor (SJIF) evaluates and indexes IJARST to provide an international impact measure.' },
  { icon: '🏛️', name: 'Zenodo', desc: 'Papers are deposited in CERN\'s Zenodo repository, ensuring permanent, citeable open-access archiving.' },
  { icon: '🎯', name: 'Academia.edu', desc: 'Research is shared on Academia.edu to increase visibility and connect with academic professionals globally.' },
  { icon: '📖', name: 'OALib', desc: 'Open Access Library (OALib) indexes IJARST articles, providing an additional discovery channel for researchers.' },
  { icon: '⭐', name: 'Citefactor', desc: 'Citefactor provides academic indexing and directory listing for IJARST journals and articles.' },
  { icon: '🔎', name: 'DRJI', desc: 'Directory of Research Journals Indexing (DRJI) lists IJARST for enhanced international discoverability.' },
  { icon: '🌍', name: 'ISI', desc: 'Submitted to the International Scientific Indexing database for global academic recognition.' },
  { icon: '🗄️', name: 'Internet Archive', desc: 'All published content is permanently archived at the Internet Archive (archive.org) for long-term preservation.' },
];

export default function Indexing() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Visibility</span>
          <h1>Indexing & Abstracting</h1>
          <p>IJARST articles are indexed across major academic databases for maximum research impact.</p>
        </div>
      </div>
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ background: '#FFF8E1', border: '2px solid #F5C400', borderRadius: 10, padding: '24px 32px', marginBottom: 48, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 40 }}>🔗</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>CrossRef DOI for Every Paper</h3>
              <p style={{ fontSize: 15, color: '#555', maxWidth: 600 }}>Every accepted and published article in IJARST receives a unique CrossRef Digital Object Identifier (DOI), ensuring permanent, internationally recognized citation links.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {databases.map(db => (
              <div key={db.name} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 10, padding: '24px', transition: 'all 0.22s', borderTop: '3px solid #1B5E20' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{db.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0D0D0D' }}>{db.name}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>{db.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
