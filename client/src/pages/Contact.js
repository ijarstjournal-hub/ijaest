import React from 'react';

export default function Contact() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Get in Touch</span>
          <h1>Contact Us</h1>
          <p>We typically respond within 24 hours. Reach us by email or WhatsApp.</p>
        </div>
      </div>
      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 56 }}>
            {[
              { icon: '📧', label: 'Email Us', sub: 'ijarstjournal@gmail.com', href: 'mailto:ijarstjournal@gmail.com', color: '#1565C0', bg: '#E3F2FD' },
              { icon: '💬', label: 'WhatsApp', sub: '+44 7479 811823', href: 'https://wa.me/447479811823', color: '#25D366', bg: '#E8F5E9' },
              { icon: '📤', label: 'Submit Paper', sub: 'Submit your manuscript', href: '/submit', color: '#1B5E20', bg: '#F1F8E9' },
            ].map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                style={{ background: c.bg, border: `1px solid ${c.color}33`, borderRadius: 10, padding: '28px 24px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.22s', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#0D0D0D', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 14, color: c.color, fontWeight: 600 }}>{c.sub}</div>
              </a>
            ))}
          </div>

          {/* By purpose */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Contact by Purpose</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {[
              { emoji: '📄', title: 'For Authors', items: ['Submit manuscript: email to ijarstjournal@gmail.com','Paper status enquiry: include your paper title in subject','APC payment queries: reference your acceptance email','Revision submission: reply to your review decision email'] },
              { emoji: '🔬', title: 'For Reviewers', items: ['Register as reviewer: email with your expertise and CV','Submit review decision: reply to the review request email','Review timeline extensions: contact ijarstjournal@gmail.com'] },
              { emoji: '📬', title: 'General Enquiries', items: ['Indexing & abstracting: ijarstjournal@gmail.com','Partnerships & collaborations: contact via email','Media & press enquiries: ijarstjournal@gmail.com','Technical website issues: WhatsApp +44 7479 811823'] },
            ].map(section => (
              <div key={section.title} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '22px 26px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
                  {section.emoji} {section.title}
                </h3>
                {section.items.map(item => (
                  <div key={item} style={{ fontSize: 14.5, color: '#555', padding: '5px 0', borderBottom: '1px solid #F5F5F5', display: 'flex', gap: 10 }}>
                    <span style={{ color: '#1B5E20' }}>›</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Direct contact box */}
          <div style={{ background: '#0D0D0D', color: '#FAFAFA', borderRadius: 12, padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#F5C400', marginBottom: 8 }}>IJARST Editorial Office</h3>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>United Kingdom 🇬🇧 · ijarst.uk</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:ijarstjournal@gmail.com" className="btn btn-yellow">📧 Send Email</a>
              <a href="https://wa.me/447479811823" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#fff', padding: '11px 28px', borderRadius: 4, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
