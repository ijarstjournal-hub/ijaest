import React from 'react';
export default function PlagiarismPolicy() {
  return (
    <>
      <div className="page-hero"><div className="container"><span className="section-badge" style={{background:'rgba(245,196,0,0.15)',color:'#F5C400'}}>Policy</span><h1>Plagiarism Policy</h1><p>Zero tolerance for plagiarism and research misconduct.</p></div></div>
      <section style={{padding:'64px 0'}}><div className="container" style={{maxWidth:800}}>
        <div style={{background:'#FFEBEE',border:'1px solid #FFCDD2',borderRadius:8,padding:'24px',marginBottom:40,display:'flex',gap:16}}>
          <span style={{fontSize:36}}>🚫</span>
          <div><h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:8,color:'#C62828'}}>Zero Tolerance Policy</h3><p style={{fontSize:15,color:'#333',lineHeight:1.7}}>IJARST maintains a zero-tolerance stance on plagiarism in all its forms. All submitted manuscripts are screened using automated tools and editorial expertise before peer review begins.</p></div>
        </div>
        {[['Definition of Plagiarism','Plagiarism includes copying text, data, images, or ideas from another source without proper attribution; paraphrasing without citation; self-plagiarism (reuse of your own previously published work without disclosure); and duplicate submission.'],['Screening Process','All manuscripts undergo automated similarity checking immediately after submission. Manuscripts with similarity indices above 20% (excluding references and quoted material) are flagged for editorial review. Manuscripts above 30% overall similarity are typically rejected outright.'],['Consequences of Plagiarism','If plagiarism is detected before publication: the manuscript is immediately rejected and the author(s) notified. If detected after publication: the article is retracted, a retraction notice is published, and the incident is reported to the author\'s institution. Confirmed plagiarists are blacklisted from IJARST for a minimum of five years.'],['Author Responsibility','Authors are responsible for ensuring all sources are properly cited, all co-authors have approved the submission, no portion of the manuscript is under simultaneous review elsewhere, and previously published data or figures are clearly identified.'],['Reporting Concerns','If you believe a published article in IJARST contains plagiarized material, please contact ijarstjournal@gmail.com with evidence. All reports are investigated confidentially.']].map(([title,text])=>(
          <div key={title} style={{marginBottom:28}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:10,paddingBottom:8,borderBottom:'2px solid #FFEBEE'}}>{title}</h2>
            <p style={{fontSize:15.5,color:'#444',lineHeight:1.8}}>{text}</p>
          </div>
        ))}
      </div></section>
    </>
  );
}
