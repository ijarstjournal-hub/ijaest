import React from 'react';
export default function PeerReviewPolicy() {
  return (
    <>
      <div className="page-hero"><div className="container"><span className="section-badge" style={{background:'rgba(245,196,0,0.15)',color:'#F5C400'}}>Policy</span><h1>Peer Review Policy</h1><p>Rigorous double-blind peer review for every submission.</p></div></div>
      <section style={{padding:'64px 0'}}><div className="container" style={{maxWidth:800}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:40}}>
          {[['🔍','Double-Blind','Reviewer and author identities kept confidential'],['⏱️','Fast Turnaround','3–7 day average review completion'],['✅','Expert Reviewers','Domain-expert reviewers for every manuscript'],['📋','Transparent Process','Authors receive detailed review comments']].map(([icon,title,desc])=>(
            <div key={title} style={{background:'#fff',border:'1px solid #E0E0E0',borderRadius:8,padding:'20px',textAlign:'center',borderTop:'3px solid #1B5E20'}}>
              <div style={{fontSize:32,marginBottom:8}}>{icon}</div>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,marginBottom:6}}>{title}</h3>
              <p style={{fontSize:13,color:'#666'}}>{desc}</p>
            </div>
          ))}
        </div>
        {[['Review Process Overview','Every manuscript submitted to IJARST undergoes a rigorous double-blind peer review process. Neither the authors nor the reviewers know each other\'s identities, ensuring an impartial and unbiased assessment of the research.'],['Stage 1: Editorial Screening','Upon receipt, manuscripts are screened by the Editor-in-Chief for scope, originality, and basic formatting requirements. Manuscripts that do not meet minimum standards are returned without peer review, typically within 48 hours.'],['Stage 2: Plagiarism Check','All manuscripts that pass initial screening are subjected to a comprehensive plagiarism check. Similarity above acceptable thresholds leads to immediate rejection without further review.'],['Stage 3: Peer Review','Approved manuscripts are assigned to at least two independent reviewers with relevant domain expertise. Reviewers evaluate scientific merit, methodology, results, and presentation quality.'],['Stage 4: Editorial Decision','Based on reviewer feedback, the Editor-in-Chief issues one of the following decisions: Accept As Is, Minor Revision Required, Major Revision Required, or Reject.'],['Reviewer Selection','Reviewers are selected from our international editorial board and external expert pool. Conflicts of interest are carefully managed, and reviewers with any potential conflict are excluded from reviewing specific manuscripts.']].map(([title,text])=>(
          <div key={title} style={{marginBottom:28}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:10,paddingBottom:8,borderBottom:'2px solid #E8F5E9'}}>{title}</h2>
            <p style={{fontSize:15.5,color:'#444',lineHeight:1.8}}>{text}</p>
          </div>
        ))}
      </div></section>
    </>
  );
}
