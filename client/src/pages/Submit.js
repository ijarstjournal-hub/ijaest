import React from 'react';

const gmailLink = () => {
  const to = 'ijarstjournal@gmail.com';
  const subject = encodeURIComponent('Manuscript Submission – IJARST');
  const body = encodeURIComponent(`Dear IJARST Editorial Team,

I wish to submit the following manuscript for consideration:

Title: 
Authors: 
Affiliation: 
Keywords: 
Abstract (brief): 

I confirm that:
- This work is original and not under review elsewhere
- All authors have approved the submission
- I agree to pay the $33 APC only upon acceptance

Manuscript attached as PDF.

Regards,
[Your Name]`);
  return `https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`;
};

export default function Submit() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Authors</span>
          <h1>Submit Your Paper</h1>
          <p>Submit your manuscript via email for fast, professional peer review.</p>
        </div>
      </div>

      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Gmail CTA */}
          <div style={{ background: '#E8F5E9', border: '2px solid #1B5E20', borderRadius: 12, padding: '36px', textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Ready to Submit?</h2>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>Click the button below to open a pre-filled Gmail template with your manuscript details.</p>
            <a href={gmailLink()} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              📤 Open Gmail & Submit
            </a>
            <p style={{ fontSize: 13, color: '#888', marginTop: 14 }}>Or email directly: <a href="mailto:ijarstjournal@gmail.com" style={{ color: '#1B5E20', fontWeight: 600 }}>ijarstjournal@gmail.com</a></p>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>WhatsApp: <a href="https://wa.me/447479811823" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>+44 7479 811823</a></p>
          </div>

          {/* Submission Process */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 28 }}>Submission Process</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {[
              ['1', 'Prepare your manuscript', 'Format your paper according to our author guidelines. Ensure proper structure: title, abstract, keywords, introduction, methodology, results, conclusion, references.'],
              ['2', 'Submit via email', 'Send your PDF manuscript to ijarstjournal@gmail.com with the subject line "Manuscript Submission – IJARST".'],
              ['3', 'Initial screening', 'Editorial team performs a scope and plagiarism check within 24–48 hours.'],
              ['4', 'Peer review', 'Manuscripts are sent for double-blind peer review. Average turnaround: 3–7 days.'],
              ['5', 'Decision & revision', 'You receive a decision: Accept, Minor Revision, Major Revision, or Reject.'],
              ['6', 'Payment & publication', 'Upon acceptance, pay the $33 APC. Your paper is published within 2 days of payment.'],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ display: 'flex', gap: 20, background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '20px 24px' }}>
                <div style={{ flexShrink: 0, width: 36, height: 36, background: '#1B5E20', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)' }}>{n}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 5 }}>{title}</h3>
                  <p style={{ fontSize: 14.5, color: '#555', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Submission Checklist</h2>
          <div style={{ background: '#F7F7F7', borderRadius: 8, padding: '24px', marginBottom: 48 }}>
            {['Manuscript is written in English','Abstract is 150–300 words','5–8 keywords included','All authors listed with affiliations','References formatted consistently (APA or IEEE)','Figures/tables are clear and labelled','PDF format, 10pt–12pt font, single or double spaced','No identifying information in manuscript body (blind review)','Corresponding author email included in cover'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14.5, color: '#333' }}>
                <span style={{ color: '#1B5E20', fontWeight: 700, fontSize: 16, marginTop: 1 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Review Timeline</h2>
          <div style={{ overflowX: 'auto', marginBottom: 48 }}>
            <table className="issues-table">
              <thead><tr><th>Stage</th><th>Typical Duration</th></tr></thead>
              <tbody>
                {[['Initial screening','24–48 hours'],['Peer review','3–7 days'],['Author revisions (if needed)','3–5 days'],['Final decision','1–2 days'],['Publication after payment','1–2 business days'],['DOI assignment','Same day as publication']].map(([stage, dur]) => (
                  <tr key={stage}><td>{stage}</td><td style={{ fontWeight: 600, color: '#1B5E20' }}>{dur}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* APC Notice */}
          <div style={{ background: '#FFF8E1', border: '2px solid #F5C400', borderRadius: 8, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Article Processing Charge (APC)</h3>
            <p style={{ fontSize: 16, color: '#333', marginBottom: 6 }}><strong>$33 USD</strong> — flat rate, no hidden fees</p>
            <p style={{ fontSize: 14, color: '#666' }}>Payable <strong>only after acceptance</strong>. You will never be asked to pay before your paper is accepted.</p>
          </div>
        </div>
      </section>
    </>
  );
}
