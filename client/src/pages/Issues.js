import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Issues() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/papers').then(r => { setPapers(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = papers.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.authors||[]).some(a => a.name.toLowerCase().includes(search.toLowerCase())));

  // Group by Volume then Issue
  const grouped = {};
  filtered.forEach(p => {
    const vk = `Volume ${p.volume}`;
    const ik = `Issue ${p.issue}`;
    if (!grouped[vk]) grouped[vk] = {};
    if (!grouped[vk][ik]) grouped[vk][ik] = [];
    grouped[vk][ik].push(p);
  });

  const volKeys = Object.keys(grouped).sort((a, b) => {
    const na = parseInt(a.replace('Volume ', ''));
    const nb = parseInt(b.replace('Volume ', ''));
    return nb - na;
  });

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Browse</span>
          <h1>Published Issues</h1>
          <p>All peer-reviewed articles published in IJARST, organized by volume and issue.</p>
        </div>
      </div>

      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <input
              className="form-control"
              style={{ maxWidth: 480, fontSize: 15 }}
              placeholder="Search by title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}><span className="spinner" /></div>
          ) : volKeys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <p style={{ fontSize: 18, marginBottom: 16 }}>No published papers found.</p>
              <Link to="/submit" className="btn btn-primary">Be the first to submit</Link>
            </div>
          ) : (
            volKeys.map(vk => (
              <div key={vk} style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#0D0D0D', marginBottom: 20, paddingBottom: 10, borderBottom: '3px solid #1B5E20' }}>{vk}</h2>
                {Object.keys(grouped[vk]).sort((a,b) => parseInt(b.replace('Issue ','')) - parseInt(a.replace('Issue ',''))).map(ik => (
                  <div key={ik} style={{ marginBottom: 32 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#1B5E20', marginBottom: 14, padding: '8px 16px', background: '#E8F5E9', borderRadius: 4, display: 'inline-block' }}>{ik}</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="issues-table">
                        <thead>
                          <tr>
                            <th style={{ width: 50 }}>S.No</th>
                            <th>Title / Authors / DOI</th>
                            <th style={{ width: 100, textAlign: 'center' }}>PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grouped[vk][ik].map((p, idx) => (
                            <tr key={p._id}>
                              <td style={{ color: '#888', fontSize: 13, fontWeight: 600 }}>{idx + 1}</td>
                              <td>
                                <Link to={`/papers/${p._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#0D0D0D', display: 'block', marginBottom: 4, textDecoration: 'none' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#1B5E20'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#0D0D0D'}>
                                  {p.title}
                                </Link>
                                <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                                  {(p.authors||[]).map(a => a.name).join(', ')}
                                </div>
                                {p.doi && (
                                  <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer"
                                    style={{ fontSize: 12, color: '#1565C0', fontFamily: 'monospace' }}>
                                    DOI: {p.doi}
                                  </a>
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <a href={`/api/papers/${p._id}/pdf`} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '6px 14px' }}>
                                  PDF ↓
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
