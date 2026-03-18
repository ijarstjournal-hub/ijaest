import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Inline citation editor — click the number to edit it
function CitationEditor({ paperId, initialValue, onSave, onError }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`/api/papers/admin/${paperId}/citations`, { citations: Number(value) });
      onSave(res.data.citations);
      setEditing(false);
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to update citations.');
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
          autoFocus
          style={{ width:60, padding:'3px 6px', background:'#1a1a1a', border:'1px solid #F5C400', borderRadius:4, color:'#FAFAFA', fontSize:13, outline:'none' }}
        />
        <button onClick={handleSave} disabled={saving} style={{ padding:'3px 8px', background:'#1B5E20', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:12, fontWeight:700 }}>
          {saving ? '...' : '✓'}
        </button>
        <button onClick={() => setEditing(false)} style={{ padding:'3px 8px', background:'#333', color:'#888', border:'none', borderRadius:4, cursor:'pointer', fontSize:12 }}>✕</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to update citation count"
      style={{ background:'none', border:'none', cursor:'pointer', color:'#F5C400', fontWeight:700, fontSize:14, padding:'2px 4px', borderRadius:4, borderBottom:'1px dashed #F5C40066' }}
    >
      {value}
    </button>
  );
}

const EMPTY_AUTHOR = { name: '', affiliation: '', email: '' };
const EMPTY_FORM = {
  title: '', abstract: '',
  authors: [{ name: '', affiliation: '', email: '' }],
  keywords: '', volume: '', issue: '',
  publicationDate: '', doi: '',
  pageStart: '1', pageEnd: '1',
  pdfBase64: null, pdfFilename: '', publishNow: false,
  pdfInputKey: Date.now(), // forces file input to remount/clear after submit
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = useCallback((msg, type) => {
    setToast(msg); setToastType(type || 'success');
    setTimeout(() => setToast(''), 3500);
  }, []);

  const fetchPapers = useCallback(async () => {
    try {
      const res = await axios.get('/api/papers/admin/all');
      setPapers(res.data || []);
    } catch { showToast('Failed to load papers.', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchPapers(); }, [fetchPapers]);

  const handleLogout = () => { logout(); navigate('/x7k-admin/login', { replace: true }); };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, authors: [{ ...EMPTY_AUTHOR }] });
    setView('form');
  };

  const openEdit = (paper) => {
    setEditingId(paper._id);
    setForm({
      title: paper.title || '', abstract: paper.abstract || '',
      authors: paper.authors && paper.authors.length
        ? paper.authors.map(a => ({ name: a.name || '', affiliation: a.affiliation || '', email: a.email || '' }))
        : [{ ...EMPTY_AUTHOR }],
      keywords: (paper.keywords || []).join(', '),
      volume: String(paper.volume || ''), issue: String(paper.issue || ''),
      publicationDate: paper.publicationDate ? paper.publicationDate.slice(0, 10) : '',
      doi: paper.doi || '', pageStart: String(paper.pageStart || 1), pageEnd: String(paper.pageEnd || 1),
      pdfBase64: null, pdfFilename: '', publishNow: false,
    });
    setView('form');
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setForm(f => ({ ...f, pdfBase64: base64, pdfFilename: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorChange = (idx, field, val) =>
    setForm(f => { const a = [...f.authors]; a[idx] = { ...a[idx], [field]: val }; return { ...f, authors: a }; });

  const addAuthor = () => setForm(f => ({ ...f, authors: [...f.authors, { ...EMPTY_AUTHOR }] }));
  const removeAuthor = (idx) => setForm(f => ({ ...f, authors: f.authors.filter((_, i) => i !== idx) }));

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.abstract.trim() || !form.volume || !form.issue) {
      showToast('Title, abstract, volume and issue are required.', 'error'); return;
    }
    if (!editingId && form.publishNow && !form.pdfBase64) {
      showToast('You must upload a PDF to publish immediately.', 'error'); return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(), abstract: form.abstract.trim(),
        authors: form.authors.filter(a => a.name && a.name.trim()),
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        volume: parseInt(form.volume), issue: parseInt(form.issue),
        publicationDate: form.publicationDate || null,
        doi: form.doi.trim() || undefined,
        pageStart: parseInt(form.pageStart) || 1,
        pageEnd: parseInt(form.pageEnd) || 1,
      };
      if (form.pdfBase64) { payload.pdfBase64 = form.pdfBase64; payload.pdfFilename = form.pdfFilename; }
      if (!editingId) payload.publishNow = form.publishNow;

      if (editingId) { await axios.put('/api/papers/admin/' + editingId, payload); showToast('Paper updated.'); }
      else { await axios.post('/api/papers/admin/create', payload); showToast('Paper created.'); }
      await fetchPapers();
      setForm(f => ({ ...f, pdfInputKey: Date.now() })); // reset file input
      setView('list');
    } catch (err) {
      showToast((err.response && err.response.data && err.response.data.message) || 'Error saving.', 'error');
    } finally { setSaving(false); }
  };

  const handleTogglePublish = async (paper) => {
    try {
      await axios.patch('/api/papers/admin/' + paper._id + '/publish');
      showToast('Paper ' + (paper.published ? 'unpublished' : 'published') + '.');
      fetchPapers();
    } catch (err) { showToast((err.response && err.response.data && err.response.data.message) || 'Error.', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/papers/admin/' + id);
      showToast('Deleted.'); setDeleteConfirm(null); fetchPapers();
    } catch (err) { showToast((err.response && err.response.data && err.response.data.message) || 'Error.', 'error'); }
  };

  const inp = { width:'100%',padding:'10px 14px',background:'#1a1a1a',border:'1.5px solid #333',borderRadius:6,color:'#FAFAFA',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'var(--font-body)' };
  const lbl = { display:'block',fontSize:12,fontWeight:600,color:'#888',marginBottom:5,letterSpacing:'0.06em',textTransform:'uppercase' };

  return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:'var(--font-body)', color:'#FAFAFA' }}>

      {toast && (
        <div style={{ position:'fixed',top:16,right:20,zIndex:9999,background:toastType==='success'?'#1B5E20':'#c62828',color:'#fff',padding:'12px 20px',borderRadius:8,fontSize:14,fontWeight:600,boxShadow:'0 4px 20px rgba(0,0,0,0.4)',maxWidth:360 }}>
          {toastType === 'success' ? '✅' : '❌'} {toast}
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
          <div style={{ background:'#111',border:'1px solid #333',borderRadius:12,padding:'32px 36px',maxWidth:400,width:'90%' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontSize:20,marginBottom:12,color:'#FAFAFA' }}>Delete Paper?</h3>
            <p style={{ fontSize:14,color:'#888',marginBottom:24,lineHeight:1.6 }}>This cannot be undone. The paper and PDF will be permanently removed.</p>
            <div style={{ display:'flex',gap:12 }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex:1,background:'#c62828',color:'#fff',border:'none',borderRadius:6,padding:11,fontWeight:700,cursor:'pointer',fontSize:14 }}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex:1,background:'#333',color:'#FAFAFA',border:'none',borderRadius:6,padding:11,fontWeight:700,cursor:'pointer',fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:'#111',borderBottom:'1px solid #222',padding:'0 28px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50 }}>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <span style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,color:'#F5C400' }}>IJARST</span>
          <span style={{ fontSize:12,color:'#555',letterSpacing:'0.08em',textTransform:'uppercase' }}>Admin Dashboard</span>
        </div>
        <div style={{ display:'flex',gap:12,alignItems:'center' }}>
          {view === 'list'
            ? <button onClick={openCreate} style={{ background:'#1B5E20',color:'#fff',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:700,cursor:'pointer',fontSize:13.5 }}>+ New Paper</button>
            : <button onClick={() => setView('list')} style={{ background:'#333',color:'#FAFAFA',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:600,cursor:'pointer',fontSize:13.5 }}>← Back</button>}
          <button onClick={handleLogout} style={{ background:'transparent',color:'#666',border:'1px solid #333',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',fontSize:13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1180,margin:'0 auto',padding:'32px 24px' }}>

        {view === 'list' && (
          <>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:16,marginBottom:32 }}>
              {[{label:'Total Papers',val:papers.length,color:'#F5C400'},{label:'Published',val:papers.filter(p=>p.published).length,color:'#1B5E20'},{label:'Drafts',val:papers.filter(p=>!p.published).length,color:'#888'}].map(s => (
                <div key={s.label} style={{ background:'#111',border:'1px solid #222',borderRadius:8,padding:'20px 22px',borderLeft:'4px solid '+s.color }}>
                  <div style={{ fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#555',marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontSize:34,fontWeight:800 }}>{s.val}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:16 }}>All Papers</h2>

            {loading ? <div style={{ textAlign:'center',padding:'60px 0' }}><span className="spinner" /></div>
            : papers.length === 0 ? (
              <div style={{ textAlign:'center',padding:'60px 0',color:'#555' }}>
                <p style={{ marginBottom:16 }}>No papers yet.</p>
                <button onClick={openCreate} style={{ background:'#1B5E20',color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',fontWeight:700,cursor:'pointer' }}>Create First Paper</button>
              </div>
            ) : (
              <div style={{ overflowX:'auto',border:'1px solid #222',borderRadius:8 }}>
                <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                  <thead>
                    <tr>
                      {['Title','Vol/Issue','PDF','Status','Views','Citations','Actions'].map(h => (
                        <th key={h} style={{ background:'#080808',color:'#F5C400',padding:'12px 14px',textAlign:'left',fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map(p => (
                      <tr key={p._id} style={{ borderBottom:'1px solid #1a1a1a' }}>
                        <td style={{ padding:'13px 14px',maxWidth:280 }}>
                          <div style={{ fontWeight:600,color:'#FAFAFA',fontSize:13,lineHeight:1.4 }}>{p.title}</div>
                          <div style={{ fontSize:11.5,color:'#555',marginTop:3 }}>{(p.authors||[]).map(a=>a.name).slice(0,2).join(', ')}{p.authors&&p.authors.length>2?' +more':''}</div>
                        </td>
                        <td style={{ padding:'13px 14px',color:'#888',whiteSpace:'nowrap' }}>V{p.volume} I{p.issue}</td>
                        <td style={{ padding:'13px 14px',whiteSpace:'nowrap' }}>
                          {p.hasPdf
                            ? <span title="Manuscript uploaded" style={{ color:'#69F0AE',fontSize:13,fontWeight:700 }}>✓ Uploaded</span>
                            : <span title="No PDF — cannot publish" style={{ color:'#FF5252',fontSize:13,fontWeight:700 }}>✗ Missing</span>
                          }
                        </td>
                        <td style={{ padding:'13px 14px',whiteSpace:'nowrap' }}>
                          <span style={{ display:'inline-block',background:p.published?'rgba(27,94,32,0.25)':'rgba(100,100,100,0.2)',color:p.published?'#81C784':'#888',border:'1px solid '+(p.published?'#2E7D32':'#444'),borderRadius:20,padding:'3px 12px',fontSize:11.5,fontWeight:700 }}>
                            {p.published ? '✓ Published' : '○ Draft'}
                          </span>
                        </td>
                        <td style={{ padding:'13px 14px',color:'#666' }}>{p.views||0}</td>
                        <td style={{ padding:'13px 14px',whiteSpace:'nowrap' }}>
                          <CitationEditor
                            paperId={p._id}
                            initialValue={p.citations || 0}
                            onSave={(newVal) => {
                              setPapers(prev => prev.map(x => x._id === p._id ? { ...x, citations: newVal } : x));
                              showToast('Citations updated.');
                            }}
                            onError={(msg) => showToast(msg, 'error')}
                          />
                        </td>
                        <td style={{ padding:'13px 14px',whiteSpace:'nowrap' }}>
                          <div style={{ display:'flex',gap:6 }}>
                            <button
                              onClick={() => p.hasPdf || p.published ? handleTogglePublish(p) : showToast('Upload a PDF before publishing.','error')}
                              title={!p.hasPdf && !p.published ? 'Upload a PDF first' : ''}
                              style={{ padding:'5px 10px',borderRadius:5,fontSize:11.5,fontWeight:700,cursor: (!p.hasPdf && !p.published) ? 'not-allowed':'pointer',border:'none',opacity:(!p.hasPdf && !p.published)?0.45:1,background:p.published?'#5c2a00':'#0a3d1a',color:p.published?'#FFAB40':'#69F0AE' }}>
                              {p.published?'Unpublish':'Publish'}
                            </button>
                            <button onClick={() => openEdit(p)} style={{ padding:'5px 10px',borderRadius:5,fontSize:11.5,fontWeight:700,cursor:'pointer',border:'none',background:'#1a2a3a',color:'#64B5F6' }}>Edit</button>
                            <button onClick={() => setDeleteConfirm(p._id)} style={{ padding:'5px 10px',borderRadius:5,fontSize:11.5,fontWeight:700,cursor:'pointer',border:'none',background:'#3a1a1a',color:'#EF9A9A' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {view === 'form' && (
          <div style={{ maxWidth:820 }}>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:24,fontWeight:700,marginBottom:28 }}>
              {editingId ? 'Edit Paper' : 'Add New Paper'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>Title *</label>
                <input style={inp} value={form.title} onChange={e => setField('title', e.target.value)} required placeholder="Full paper title" />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>Abstract *</label>
                <textarea style={{ ...inp, minHeight:130, resize:'vertical' }} value={form.abstract} onChange={e => setField('abstract', e.target.value)} required placeholder="Abstract (150–300 words)" />
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
                  <label style={{ ...lbl, marginBottom:0 }}>Authors</label>
                  <button type="button" onClick={addAuthor} style={{ background:'#1B5E20',color:'#fff',border:'none',borderRadius:5,padding:'5px 14px',fontWeight:700,cursor:'pointer',fontSize:12.5 }}>+ Add</button>
                </div>
                {form.authors.map((author, idx) => (
                  <div key={idx} style={{ background:'#111',border:'1px solid #222',borderRadius:8,padding:16,marginBottom:10 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
                      <span style={{ fontSize:12,fontWeight:700,color:'#555' }}>Author {idx+1}</span>
                      {form.authors.length > 1 && <button type="button" onClick={() => removeAuthor(idx)} style={{ background:'none',border:'none',color:'#EF9A9A',cursor:'pointer',fontSize:12,fontWeight:700 }}>Remove</button>}
                    </div>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10 }}>
                      {[{f:'name',p:'Full name *'},{f:'affiliation',p:'Institution'},{f:'email',p:'Email'}].map(fi => (
                        <input key={fi.f} style={inp} value={author[fi.f]} onChange={e => handleAuthorChange(idx, fi.f, e.target.value)} placeholder={fi.p} type={fi.f==='email'?'email':'text'} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>Keywords (comma separated)</label>
                <input style={inp} value={form.keywords} onChange={e => setField('keywords', e.target.value)} placeholder="machine learning, AI, optimization" />
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:18 }}>
                {[{l:'Volume *',k:'volume',t:'number',p:'1'},{l:'Issue *',k:'issue',t:'number',p:'1'},{l:'Publication Date',k:'publicationDate',t:'date'},{l:'DOI (auto if blank)',k:'doi',t:'text',p:'10.5678/...'},{l:'Page Start',k:'pageStart',t:'number',p:'1'},{l:'Page End',k:'pageEnd',t:'number',p:'10'}].map(f => (
                  <div key={f.k}>
                    <label style={lbl}>{f.l}</label>
                    <input style={inp} type={f.t} placeholder={f.p} min={f.t==='number'?1:undefined} value={form[f.k]} onChange={e => setField(f.k, e.target.value)} required={f.k==='volume'||f.k==='issue'} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={lbl}>
                  {editingId ? 'Replace PDF (optional — leave blank to keep existing)' : 'Upload Manuscript PDF *'}
                </label>
                {!editingId && (
                  <div style={{ background:'rgba(255,171,64,0.08)',border:'1px solid rgba(255,171,64,0.25)',borderRadius:6,padding:'10px 14px',marginBottom:10,fontSize:13,color:'#FFAB40' }}>
                    ⚠️ A PDF must be uploaded before this paper can be published. This is the file readers will download.
                  </div>
                )}
                <input
                  key={form.pdfInputKey}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  style={{ display:'block',color:'#888',fontSize:13.5 }}
                />
                {form.pdfFilename
                  ? <p style={{ fontSize:12.5,color:'#81C784',marginTop:6 }}>✅ {form.pdfFilename} — ready to upload</p>
                  : editingId
                    ? <p style={{ fontSize:12,color:'#555',marginTop:5 }}>No new file selected. Existing manuscript will be kept.</p>
                    : null
                }
              </div>
              {!editingId && (
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer' }}>
                    <input type="checkbox" checked={form.publishNow} onChange={e => setField('publishNow', e.target.checked)} style={{ width:16,height:16,cursor:'pointer' }} />
                    <span style={{ fontSize:14,color:'#CCCCCC',fontWeight:600 }}>Publish immediately after creating</span>
                  </label>
                  {form.publishNow && !form.pdfBase64 && (
                    <p style={{ fontSize:12.5,color:'#FF5252',marginTop:8,paddingLeft:26 }}>
                      ✗ You must upload a PDF to publish immediately. Upload above or uncheck this option.
                    </p>
                  )}
                </div>
              )}
              <div style={{ display:'flex',gap:12 }}>
                <button type="submit" disabled={saving} style={{ background:saving?'#333':'#1B5E20',color:'#fff',border:'none',borderRadius:6,padding:'12px 32px',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontSize:15,display:'inline-flex',alignItems:'center',gap:8 }}>
                  {saving ? <><span className="spinner" style={{ width:16,height:16,borderWidth:2 }} /> Saving...</> : editingId ? 'Update Paper' : 'Create Paper'}
                </button>
                <button type="button" onClick={() => setView('list')} style={{ background:'#222',color:'#CCCCCC',border:'none',borderRadius:6,padding:'12px 24px',fontWeight:600,cursor:'pointer',fontSize:14 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
