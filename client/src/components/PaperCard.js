import React from 'react';
import { Link } from 'react-router-dom';

export default function PaperCard({ paper }) {
  if (!paper) return null;

  const authors = (paper.authors || []).map((a) => a.name).join(', ');
  const pubDate = paper.publicationDate
    ? new Date(paper.publicationDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E0E0E0',
        borderRadius: 8,
        padding: '24px 26px',
        transition: 'all 0.22s',
        borderLeft: '4px solid #1B5E20',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Vol/Issue badge */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          background: '#E8F5E9', color: '#1B5E20', fontSize: 11,
          fontWeight: 700, padding: '3px 10px', borderRadius: 20,
          fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Vol. {paper.volume} · Issue {paper.issue}
        </span>
        {pubDate && (
          <span style={{ fontSize: 12, color: '#888', marginLeft: 10, fontFamily: 'var(--font-body)' }}>
            {pubDate}
          </span>
        )}
      </div>

      {/* Title */}
      <Link to={`/papers/${paper._id}`} style={{ textDecoration: 'none' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          color: '#0D0D0D',
          marginBottom: 8,
          lineHeight: 1.35,
          transition: 'color 0.18s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#1B5E20'}
          onMouseLeave={e => e.currentTarget.style.color = '#0D0D0D'}
        >
          {paper.title}
        </h3>
      </Link>

      {/* Authors */}
      {authors && (
        <p style={{ fontSize: 13.5, color: '#555', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
          <strong>Authors:</strong> {authors}
        </p>
      )}

      {/* Abstract excerpt */}
      {paper.abstract && (
        <p style={{
          fontSize: 13.5, color: '#666', lineHeight: 1.6,
          fontFamily: 'var(--font-body)', marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {paper.abstract}
        </p>
      )}

      {/* Keywords */}
      {paper.keywords && paper.keywords.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {paper.keywords.slice(0, 5).map((kw) => (
            <span key={kw} className="keyword-tag">{kw}</span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: '#888' }}>
          <span>👁 {paper.views || 0} views</span>
          <span>⬇ {paper.downloads || 0} downloads</span>
          {paper.doi && <span style={{ fontFamily: 'monospace', fontSize: 11 }}>DOI: {paper.doi}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/papers/${paper._id}`} className="btn btn-outline btn-sm">
            View →
          </Link>
          <a href={`/api/papers/${paper._id}/pdf`} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
            PDF ↓
          </a>
        </div>
      </div>
    </div>
  );
}
