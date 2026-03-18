import React from 'react';
import { Link } from 'react-router-dom';
export default function AuthorsGuide() {
  return (
    <>
      <div className="page-hero"><div className="container"><span className="section-badge" style={{background:'rgba(245,196,0,0.15)',color:'#F5C400'}}>Guide</span><h1>Authors' Guide</h1><p>Everything you need to prepare and submit a successful manuscript.</p></div></div>
      <section style={{padding:'64px 0'}}><div className="container" style={{maxWidth:860}}>
        {/* Manuscript structure */}
        <h2 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,marginBottom:20}}>Manuscript Structure</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14,marginBottom:40}}>
          {[['Title','Clear, descriptive, no abbreviations. Max 20 words recommended.'],['Abstract','150–300 words. Include objective, methods, results, conclusion.'],['Keywords','5–8 keywords; avoid repeating title words.'],['Introduction','Background, problem statement, objectives, paper structure.'],['Methodology','Reproducible description of methods, materials, procedures.'],['Results','Data presented clearly; tables and figures must be labelled.'],['Discussion','Interpret results; compare with literature; limitations noted.'],['Conclusion','Summarise key findings and future directions.'],['References','Consistent format (APA, IEEE, or Vancouver). All cited sources listed.']].map(([sec,desc])=>(
            <div key={sec} style={{background:'#fff',border:'1px solid #E0E0E0',borderRadius:6,padding:'16px'}}>
              <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#1B5E20',marginBottom:4}}>{sec}</div>
              <div style={{fontSize:13.5,color:'#555',lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:700,marginBottom:20}}>Formatting Requirements</h2>
        <div style={{overflowX:'auto',marginBottom:40}}>
          <table className="issues-table">
            <thead><tr><th>Parameter</th><th>Requirement</th></tr></thead>
            <tbody>
              {[['File format','PDF (primary); Word .docx acceptable'],['Font','Times New Roman or Arial, 10–12pt'],['Spacing','Single or double spaced'],['Page size','A4'],['Margins','At least 2.5cm on all sides'],['Language','English (British or American, consistent)'],['Word count','Minimum 2,000 words; no strict maximum'],['Figures/Tables','High resolution (min 300 DPI); numbered sequentially'],['Equations','Typed using equation editor; numbered in parentheses'],['References','In-text citation consistent with reference list style']].map(([k,v])=>(
                <tr key={k}><td style={{fontWeight:600}}>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:700,marginBottom:20}}>Ethical Requirements</h2>
        <div style={{background:'#F7F7F7',borderRadius:8,padding:'24px',marginBottom:40}}>
          {['All listed authors must have made a genuine contribution to the work','Funding sources must be disclosed in an Acknowledgements section','Any potential conflicts of interest must be declared','Human or animal subjects research must confirm ethical approval','Data fabrication, falsification, and plagiarism will result in rejection and blacklisting','Simultaneous submission to other journals is not permitted'].map(item=>(
            <div key={item} style={{display:'flex',gap:10,marginBottom:10,fontSize:15,color:'#333'}}>
              <span style={{color:'#1B5E20',fontWeight:700}}>✓</span><span>{item}</span>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center'}}>
          <Link to="/submit" className="btn btn-primary" style={{fontSize:16,padding:'14px 36px'}}>Submit Your Paper Now →</Link>
          <p style={{marginTop:14,fontSize:14,color:'#888'}}>Questions? Email <a href="mailto:ijarstjournal@gmail.com" style={{color:'#1B5E20'}}>ijarstjournal@gmail.com</a></p>
        </div>
      </div></section>
    </>
  );
}
