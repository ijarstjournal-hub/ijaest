import React from 'react';
import { Link } from 'react-router-dom';

export default function Fees() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Pricing</span>
          <h1>Publication Fees</h1>
          <p>Transparent, affordable open-access publishing. No hidden costs.</p>
        </div>
      </div>
      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Fee table */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>APC Schedule</h2>
          <div style={{ overflowX: 'auto', marginBottom: 48 }}>
            <table className="issues-table">
              <thead>
                <tr><th>Category</th><th>APC</th><th>Includes</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>All Authors (International)</td>
                  <td style={{ fontWeight: 800, color: '#1B5E20', fontSize: 18 }}>$33 USD</td>
                  <td>DOI assignment, Open Access, PDF generation, permanent archiving, indexing submission</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Waiver (Hardship)</td>
                  <td style={{ fontWeight: 700, color: '#888' }}>Contact us</td>
                  <td>Available for researchers from low-income countries upon request</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* What APC covers */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>What Your APC Covers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 48 }}>
            {[['🔗','CrossRef DOI Assignment','Your paper receives a permanent, citable Digital Object Identifier.'],['🌐','Open Access Publishing','Freely accessible to all readers worldwide, forever.'],['📄','Formatted PDF','Professional journal-layout PDF generated for your paper.'],['🗄️','Permanent Archiving','Deposited in Zenodo and Internet Archive for long-term preservation.'],['📊','Indexing Submission','Submitted to Google Scholar, ResearchBib, SJIF, and other databases.'],['📧','Author Support','Editorial team available via email and WhatsApp throughout the process.']].map(([icon, title, desc]) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '22px', borderTop: '3px solid #1B5E20' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: '#666', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Payment instructions */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>How to Pay</h2>
          <div style={{ background: '#F7F7F7', borderRadius: 8, padding: '28px', marginBottom: 32 }}>
            {[['1','Receive acceptance email','You will receive an official acceptance decision from the editorial team.'],['2','Receive payment details','The APC invoice and payment instructions will be included in your acceptance email.'],['3','Pay securely','Payment accepted via bank transfer or other methods specified in your acceptance email.'],['4','Confirm payment','Send payment confirmation to ijarstjournal@gmail.com with your paper reference.'],['5','Publication','Your paper is published within 1–2 business days of payment confirmation.']].map(([n, title, desc]) => (
              <div key={n} style={{ display: 'flex', gap: 16, marginBottom: 18, paddingBottom: 18, borderBottom: n !== '5' ? '1px solid #E0E0E0' : 'none' }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, background: '#1B5E20', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{n}</div>
                <div><strong style={{ fontSize: 15 }}>{title}</strong><br /><span style={{ fontSize: 14, color: '#666' }}>{desc}</span></div>
              </div>
            ))}
          </div>

          {/* Waiver */}
          <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 8, padding: '24px', marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>🤝 Waiver Policy</h3>
            <p style={{ fontSize: 15, color: '#333', lineHeight: 1.7 }}>IJARST is committed to global equity in publishing. Authors from countries classified as low-income by the World Bank, or those experiencing genuine financial hardship, may apply for a partial or full waiver of the APC.<br /><br />To apply, email <a href="mailto:ijarstjournal@gmail.com" style={{ color: '#1B5E20', fontWeight: 600 }}>ijarstjournal@gmail.com</a> with a brief explanation. Waivers are granted solely at the discretion of the editorial team and do not affect the review decision.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/submit" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>Submit Your Paper →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
