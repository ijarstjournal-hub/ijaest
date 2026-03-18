import React from 'react';

export default function AimsScope() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>About</span>
          <h1>Aims & Scope</h1>
          <p>IJARST's mission, research areas, and publication objectives.</p>
        </div>
      </div>
      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Mission */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Journal Mission</h2>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: '#444', marginBottom: 40 }}>
            The International Journal of Applied Research in Science & Technology (IJARST) is a peer-reviewed, open-access academic journal published from the United Kingdom. IJARST is committed to the dissemination of original, high-quality research that bridges scientific theory with practical application. We aim to provide researchers, academicians, and practitioners with a credible platform to share knowledge, advance their disciplines, and contribute to global scientific progress.
          </p>

          {/* Aims */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Aims</h2>
          <div style={{ marginBottom: 40 }}>
            {['Publish original, peer-reviewed research in engineering, applied sciences, and interdisciplinary fields','Promote open-access publishing to ensure knowledge is freely accessible globally','Provide rapid, rigorous, and fair double-blind peer review','Support early-career researchers and academics from developing nations','Encourage interdisciplinary research that crosses traditional boundaries','Maintain the highest standards of publication ethics and research integrity','Provide a DOI-indexed, citable record for all published works'].map(aim => (
              <div key={aim} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12, padding: '12px 16px', background: '#F7F7F7', borderRadius: 6, borderLeft: '3px solid #1B5E20' }}>
                <span style={{ color: '#1B5E20', fontWeight: 700, fontSize: 16, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 15, color: '#333' }}>{aim}</span>
              </div>
            ))}
          </div>

          {/* Scope */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Scope of Publication</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { title: 'Engineering & Applied Sciences', items: ['Electrical & Electronic Engineering','Mechanical & Manufacturing Engineering','Civil & Structural Engineering','Chemical Engineering & Process Design','Industrial & Systems Engineering','Environmental Engineering'] },
              { title: 'Computer Science & Technology', items: ['Artificial Intelligence & Machine Learning','Software Engineering & Development','Cybersecurity & Network Systems','Data Science & Big Data Analytics','Computer Vision & Image Processing','Internet of Things (IoT)'] },
              { title: 'Emerging Technologies', items: ['Renewable Energy & Smart Grid','Nanotechnology & Advanced Materials','Biotechnology & Biomedical Engineering','Robotics & Autonomous Systems','3D Printing & Additive Manufacturing','Blockchain & Distributed Systems'] },
              { title: 'Interdisciplinary Research', items: ['Technology Policy & Management','STEM Education & Pedagogy','Sustainability & Green Technologies','Healthcare Technology & eHealth','Agriculture Technology & Precision Farming','Urban Planning & Smart Cities'] },
            ].map(cat => (
              <div key={cat.title} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: 8, padding: '22px', borderTop: '3px solid #1B5E20' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#0D0D0D' }}>{cat.title}</h3>
                {cat.items.map(item => (
                  <div key={item} style={{ fontSize: 13.5, color: '#555', padding: '5px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#1B5E20' }}>›</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Info table */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Journal Information</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="issues-table">
              <tbody>
                {[['Full Name','International Journal of Applied Research in Science & Technology'],['Acronym','IJARST'],['ISSN','Pending Registration'],['e-ISSN','Pending Registration'],['Established','2024'],['Publication Frequency','Continuous / Rolling'],['Access Type','Open Access'],['Peer Review','Double-Blind'],['Language','English'],['Publisher','IJARST Editorial Office, United Kingdom'],['Country','United Kingdom 🇬🇧'],['APC','$33 USD (after acceptance only)'],['DOI','CrossRef DOI for every paper']].map(([k, v]) => (
                  <tr key={k}><td style={{ fontWeight: 700, width: '40%', color: '#1B5E20' }}>{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
