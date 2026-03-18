import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MetaTag({ name, content }) {
  useEffect(() => {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
    return () => { if (el && el.parentNode) el.parentNode.removeChild(el); };
  }, [name, content]);
  return null;
}

export default function SinglePaper() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    axios.get(`/api/papers/${id}`)
      .then(r => { setPaper(r.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.message || 'Paper not found.'); setLoading(false); });
  }, [id]);

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(label); setTimeout(() => setCopied(''), 2500); });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}><span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>;
  if (error || !paper) return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: '#1B5E20', fontSize: 60 }}>404</h2>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>{error || 'Paper not found.'}</p>
      <Link to="/issues" className="btn btn-primary">Browse Issues</Link>
    </div>
  );

  const pubDate = paper.publicationDate ? new Date(paper.publicationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
  const authorsStr = (paper.authors || []).map(a => a.name).join(', ');
  const pdfUrl = `https://ijarst.uk/api/papers/${id}/pdf`;

  const apaStr = `${authorsStr}. (${paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 'n.d.'}). ${paper.title}. International Journal of Applied Research in Science & Technology, ${paper.volume}(${paper.issue}). https://doi.org/${paper.doi}`;
  const bibtexStr = `@article{ijarst${paper.volume}_${paper.issue}_${id.slice(-6)},\n  title={${paper.title}},\n  author={${(paper.authors||[]).map(a => a.name).join(' and ')}},\n  journal={International Journal of Applied Research in Science \\& Technology},\n  volume={${paper.volume}},\n  number={${paper.issue}},\n  year={${paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 'n.d.'}},\n  doi={${paper.doi}}\n}`;

  return (
    <>
      {/* Google Scholar meta tags */}
      <MetaTag name="citation_title" content={paper.title} />
      {(paper.authors||[]).map((a,i) => <MetaTag key={i} name="citation_author" content={a.name} />)}
      <MetaTag name="citation_journal_title" content="International Journal of Applied Research in Science & Technology" />
      <MetaTag name="citation_issn" content="XXXX-XXXX" />
      <MetaTag name="citation_volume" content={String(paper.volume)} />
      <MetaTag name="citation_issue" content={String(paper.issue)} />
      <MetaTag name="citation_publication_date" content={paper.publicationDate ? new Date(paper.publicationDate).toISOString().slice(0,10) : ''} />
      <MetaTag name="citation_pdf_url" content={pdfUrl} />
      <MetaTag name="citation_doi" content={paper.doi} />
      <MetaTag name="citation_firstpage" content={String(paper.pageStart || 1)} />
      <MetaTag name="citation_lastpage" content={String(paper.pageEnd || 1)} />

      <div style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
            <Link to="/" style={{ color: '#1B5E20' }}>Home</Link> › <Link to="/issues" style={{ color: '#1B5E20' }}>Issues</Link> › <span>Article</span>
          </div>

          {/* Journal header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 20, padding: '14px 20px', background: '#F7F7F7', borderRadius: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Volume {paper.volume}, Issue {paper.issue}</span>
            <span style={{ fontSize: 13, color: '#888' }}>ISSN: XXXX-XXXX | Open Access</span>
          </div>

          {/* Green rule */}
          <div style={{ height: 3, background: '#1B5E20', marginBottom: 28, borderRadius: 2 }} />

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, color: '#0D0D0D', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 28, lineHeight: 1.3 }}>
            {paper.title}
          </h1>

          {/* Authors */}
          <div style={{ marginBottom: 28 }}>
            {(paper.authors || []).map((a, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: i < paper.authors.length - 1 ? 14 : 0, borderBottom: i < paper.authors.length - 1 ? '1px solid #EEE' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>{a.name}</div>
                {a.affiliation && <div style={{ fontSize: 14, color: '#666' }}>{a.affiliation}</div>}
                {a.email && <a href={`mailto:${a.email}`} style={{ fontSize: 13.5, color: '#1565C0' }}>{a.email}</a>}
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EEE', marginBottom: 28 }} />

          {/* Abstract */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1B5E20', marginBottom: 12 }}>Abstract</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', textAlign: 'justify', paddingLeft: 16, borderLeft: '3px solid #1B5E20' }}>
              {paper.abstract}
            </p>
          </div>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 10 }}>Keywords:</span>
              {paper.keywords.map(kw => <span key={kw} className="keyword-tag">{kw}</span>)}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #EEE', marginBottom: 28 }} />

          {/* Metadata box */}
          <div style={{ background: '#F7F7F7', borderRadius: 8, padding: '24px', border: '1px solid #E0E0E0', marginBottom: 28 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1B5E20', marginBottom: 16 }}>Article Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {[
                ['Journal', 'IJARST'],
                ['Volume', `${paper.volume}`],
                ['Issue', `${paper.issue}`],
                ['Published', pubDate],
                ['DOI', paper.doi || 'Pending'],
                ['ISSN', 'XXXX-XXXX'],
                ['Pages', `${paper.pageStart || 1}–${paper.pageEnd || 1}`],
                ['Access', 'Open Access'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 14, color: '#333', fontWeight: 500, fontFamily: label === 'DOI' ? 'monospace' : 'inherit', fontSize: label === 'DOI' ? 12 : 14 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 28, fontSize: 14, color: '#888' }}>
            <span>👁 {paper.views || 0} views</span>
            <span>⬇ {paper.downloads || 0} downloads</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <a href={`/api/papers/${id}/pdf`} target="_blank" rel="noreferrer" className="btn btn-primary">
              ⬇ Download PDF
            </a>
            <button className="btn btn-outline" onClick={() => copyText(apaStr, 'apa')}>
              {copied === 'apa' ? '✓ Copied!' : '📋 Copy APA Citation'}
            </button>
            <button className="btn btn-outline" onClick={() => copyText(bibtexStr, 'bibtex')}>
              {copied === 'bibtex' ? '✓ Copied!' : '📋 Copy BibTeX'}
            </button>
          </div>

          {copied && <div className="alert alert-success" style={{ marginBottom: 16 }}>Citation copied to clipboard!</div>}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/issues" style={{ color: '#888', fontSize: 14 }}>← Back to all issues</Link>
          </div>
        </div>
      </div>
    </>
  );
}
