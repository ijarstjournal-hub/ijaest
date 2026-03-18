import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  title: '', abstract: '', volume: '', issue: '',
  publicationDate: '', doi: '', keywords: '', pageStart: '', pageEnd: '',
  pdfBase64: '', pdfFilename: '', publishNow: false,
  authors: [{ name: '', affiliation: '', email: '' }],
};

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [deleteId, setDeleteId] = useState(null);

  const fetchPapers = useCallback(() => {
    setLoading(true);
    axios.get('/api/papers/admin/all')
      .then(r => setPapers(r.data || []))
      .catch(err => { if (err.response?.status === 401) { logout(); navigate('/x7k-admin/login'); } })
      .finally(() => setLoading(false));
  }, [logout, navigate]);

  useEffect(() => { fetchPapers(); }, [fetchPapers]);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleLogout = async () => {
    await axios.post('/api/admin/logout').catch(() => {});
    logout();
    navigate('/x7k-admin/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      setForm(f => ({ ...f, pdfBase64: base64, pdfFilename: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorChange = (idx, field, value) => {
    setForm(f => {
      const authors = [...f.authors];
      authors[idx] = { ...authors[idx], [field]: value };
      return { ...f, authors };
    });
  };

  const addAuthor = () => setForm(f => ({ ...f, authors: [...f.authors, { name: '', affiliation: '', email: '' }] }));
  const removeAuthor = (idx) => setForm(f => ({ ...f, authors: f.authors.filter((_, i) => i !== idx) }));

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setView('create'); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '', abstract: p.abstract || '',
      volume: p.volume || '', issue: p.issue || '',
      publicationDate: p.publicationDate ? new Date(p.publicationDate).toISOString().slice(0, 10) : '',
      doi: p.doi || '', keywords: (p.keywords || []).join(', '),
      pageStart: p.pageStart || '', pageEnd: p.pageEnd || '',
      pdfBase64: '', pdfFilename: '', publishNow: false,
      authors: p.authors && p.authors.length > 0 ? p.authors : [{ name: '', affiliation: '', email: '' }],
    });
    setEditId(p._id);
    setView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      volume: Number(form.volume),
      issue: Number(form.issue),
      pageStart: form.pageStart ? Number(form.pageStart) : 1,
      pageEnd: form.pageEnd ? Number(form.pageEnd) : 1,
    };
    try {
      if (view === 'create') {
        await axios.post('/api/papers/admin/create', payload);
        showMsg('Paper created successfully!');
      } else {
        await axios.put(`/api/papers/admin/${editId}`, payload);
        showMsg('Paper updated successfully!');
      }
      fetchPapers();
      setView('list');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id) => {
    try {
      await axios.patch(`/api/papers/admin/${id}/publish`);
      showMsg('Publish status updated!');
      fetchPapers();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to toggle publish.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/papers/admin/${deleteId}`);
      showMsg('Paper deleted.');
      setDeleteId(null);
      fetchPapers();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Delete failed.', 'error');
    }
  };

  const totalPapers = papers.length;
  const published = papers.filter(p => p.published).length;
  const drafts = papers.filter(p => !p.published).length;

  const S = {
    wrap: { minHeight: '100vh', background: '#0D0D0D', fontFamily: 'var(--font-body)' },
    topbar: { background: '#111', borderBottom: '1px solid #222', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    brand: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#F5C400' },
    main: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
    stat: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '22px 28px', textAlign: 'center' },
    tableHead: { background: '#1a1a1a', color: '#F5C400', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 16px', textAlign: 'left' },
    td: { padding: '14px 16px', borderBottom: '1px solid #1a1a1a', verticalAlign: 'top', color: '#CCC', fontSize: 14 },
    input: { width: '100%', padding: '10px 14px', background: '#111', border: '1.5px solid #333', borderRadius: 6, color: '#FAFAFA', fontSize: 14, fontFamily: 'var(--font-body)' },
    label: { display: 'block', fontSize: 11.5, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  };

  return (
    <div style={S.wrap}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={S.brand}>IJARST</span>
          <span style={{ fontSize: 12, color: '#555', borderLeft: '1px solid #333', paddingLeft: 16 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#666' }}>{admin?.email}</span>
          <button onClick={handleLogout} style={{ background: '#2a2a2a', color: '#CCC', border: '1px solid #333', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={S.main}>
        {/* Message */}
        {msg.text && (
          <div style={{ background: msg.type === 'error' ? '#2a1010' : '#0a2a0a', border: `1px solid ${msg.type === 'error' ? '#5c1010' : '#1B5E20'}`, color: msg.type === 'error' ? '#ff6b6b' : '#4CAF50', padding: '12px 18px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {msg.text}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
          {[['📄', 'Total Papers', totalPapers], ['✅', 'Published', published], ['📝', 'Drafts', drafts]].map(([icon, label, count]) => (
            <div key={label} style={S.stat}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F5C400', fontFamily: 'var(--font-display)' }}>{count}</div>
              <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Delete confirmation modal */}
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 36, maxWidth: 440, width: '100%', margin: '0 24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#FAFAFA', marginBottom: 12 }}>Delete Paper?</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>This action cannot be undone. The paper and its PDF will be permanently deleted.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={confirmDelete} style={{ flex: 1, padding: '11px', background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Delete</button>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '11px', background: '#2a2a2a', color: '#CCC', border: '1px solid #333', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {view === 'list' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: '#FAFAFA', fontSize: 22 }}>All Papers</h2>
              <button onClick={openCreate} style={{ background: '#1B5E20', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add New Paper</button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}><span className="spinner" style={{ width: 32, height: 32, borderTopColor: '#F5C400', borderColor: '#333' }} /></div>
            ) : papers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#1a1a1a', borderRadius: 8, color: '#555' }}>
                <p style={{ marginBottom: 16, fontSize: 16 }}>No papers yet.</p>
                <button onClick={openCreate} style={{ background: '#1B5E20', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', cursor: 'pointer', fontWeight: 700 }}>Create First Paper</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', borderRadius: 10, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      {['Title', 'Authors', 'Vol / Issue', 'Status', 'Views', 'Actions'].map(h => (
                        <th key={h} style={S.tableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map(p => (
                      <tr key={p._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...S.td, maxWidth: 280 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FAFAFA', fontSize: 14, lineHeight: 1.3 }}>{p.title}</div>
                          {p.doi && <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace', marginTop: 3 }}>{p.doi}</div>}
                        </td>
                        <td style={{ ...S.td, maxWidth: 160 }}>
                          {(p.authors || []).map(a => a.name).join(', ') || '—'}
                        </td>
                        <td style={S.td}>Vol. {p.volume} / Iss. {p.issue}</td>
                        <td style={S.td}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: p.published ? '#0a2a0a' : '#2a2a00', color: p.published ? '#4CAF50' : '#F5C400' }}>
                            {p.published ? '● Published' : '○ Draft'}
                          </span>
                        </td>
                        <td style={S.td}>{p.views || 0}</td>
                        <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button onClick={() => togglePublish(p._id)} style={{ padding: '5px 12px', background: p.published ? '#2a2a00' : '#0a2a0a', color: p.published ? '#F5C400' : '#4CAF50', border: `1px solid ${p.published ? '#F5C40044' : '#4CAF5044'}`, borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              {p.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', background: '#1a2a3a', color: '#64B5F6', border: '1px solid #1565C044', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              Edit
                            </button>
                            <button onClick={() => setDeleteId(p._id)} style={{ padding: '5px 12px', background: '#2a1010', color: '#ff6b6b', border: '1px solid #c6282844', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          /* CREATE / EDIT FORM */
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <button onClick={() => setView('list')} style={{ background: '#2a2a2a', color: '#CCC', border: '1px solid #333', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>← Back</button>
              <h2 style={{ fontFamily: 'var(--font-display)', color: '#FAFAFA', fontSize: 22 }}>{view === 'create' ? 'Add New Paper' : 'Edit Paper'}</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Title */}
              <div><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>

              {/* Abstract */}
              <div><label style={S.label}>Abstract *</label><textarea style={{ ...S.input, minHeight: 120, resize: 'vertical' }} value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))} required /></div>

              {/* Authors */}
              <div>
                <label style={S.label}>Authors</label>
                {form.authors.map((a, i) => (
                  <div key={i} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '16px', marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                      <div><label style={{ ...S.label, color: '#666' }}>Name</label><input style={S.input} placeholder="Author Name" value={a.name} onChange={e => handleAuthorChange(i, 'name', e.target.value)} /></div>
                      <div><label style={{ ...S.label, color: '#666' }}>Affiliation</label><input style={S.input} placeholder="Institution" value={a.affiliation} onChange={e => handleAuthorChange(i, 'affiliation', e.target.value)} /></div>
                      <div><label style={{ ...S.label, color: '#666' }}>Email</label><input style={S.input} type="email" placeholder="email@example.com" value={a.email} onChange={e => handleAuthorChange(i, 'email', e.target.value)} /></div>
                    </div>
                    {form.authors.length > 1 && <button type="button" onClick={() => removeAuthor(i)} style={{ marginTop: 10, background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 13 }}>Remove author</button>}
                  </div>
                ))}
                <button type="button" onClick={addAuthor} style={{ background: '#1a2a1a', color: '#4CAF50', border: '1px solid #1B5E2044', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>+ Add Author</button>
              </div>

              {/* Row: Vol, Issue, Date */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
                <div><label style={S.label}>Volume *</label><input style={S.input} type="number" min="1" value={form.volume} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} required /></div>
                <div><label style={S.label}>Issue *</label><input style={S.input} type="number" min="1" value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} required /></div>
                <div><label style={S.label}>Publication Date</label><input style={S.input} type="date" value={form.publicationDate} onChange={e => setForm(f => ({ ...f, publicationDate: e.target.value }))} /></div>
                <div><label style={S.label}>Page Start</label><input style={S.input} type="number" min="1" value={form.pageStart} onChange={e => setForm(f => ({ ...f, pageStart: e.target.value }))} /></div>
                <div><label style={S.label}>Page End</label><input style={S.input} type="number" min="1" value={form.pageEnd} onChange={e => setForm(f => ({ ...f, pageEnd: e.target.value }))} /></div>
              </div>

              {/* DOI and Keywords */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={S.label}>DOI (leave blank to auto-generate)</label><input style={S.input} value={form.doi} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} placeholder="Auto-generated on save" /></div>
                <div><label style={S.label}>Keywords (comma-separated)</label><input style={S.input} value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="Machine learning, IoT, Renewable energy" /></div>
              </div>

              {/* PDF Upload */}
              <div>
                <label style={S.label}>PDF Upload {view === 'edit' ? '(leave blank to keep existing)' : ''}</label>
                <input type="file" accept=".pdf" onChange={handleFileChange} style={{ ...S.input, padding: '8px' }} />
                {form.pdfFilename && <div style={{ marginTop: 6, fontSize: 12, color: '#4CAF50' }}>✓ {form.pdfFilename}</div>}
              </div>

              {/* Publish checkbox */}
              {view === 'create' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="publishNow" checked={form.publishNow} onChange={e => setForm(f => ({ ...f, publishNow: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <label htmlFor="publishNow" style={{ color: '#CCC', fontSize: 15, cursor: 'pointer' }}>Publish immediately (generates formatted PDF)</label>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '13px', background: saving ? '#555' : '#1B5E20', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  {saving ? <><span className="spinner" style={{ width: 18, height: 18, borderTopColor: '#1B5E20', borderColor: '#888' }} /> Saving...</> : `${view === 'create' ? 'Create' : 'Update'} Paper`}
                </button>
                <button type="button" onClick={() => setView('list')} style={{ padding: '13px 24px', background: '#2a2a2a', color: '#CCC', border: '1px solid #333', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
