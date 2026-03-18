import React from 'react';
export default function OpenAccessPolicy() {
  return (
    <>
      <div className="page-hero"><div className="container"><span className="section-badge" style={{background:'rgba(245,196,0,0.15)',color:'#F5C400'}}>Policy</span><h1>Open Access Policy</h1><p>IJARST is fully committed to open access publishing.</p></div></div>
      <section style={{padding:'64px 0'}}><div className="container" style={{maxWidth:800}}>
        <div style={{background:'#E8F5E9',border:'1px solid #A5D6A7',borderRadius:8,padding:'24px',marginBottom:36,display:'flex',gap:16,alignItems:'flex-start'}}>
          <span style={{fontSize:36}}>🔓</span>
          <div><h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,marginBottom:8}}>100% Open Access</h3><p style={{fontSize:15,color:'#333',lineHeight:1.7}}>All articles published in IJARST are immediately and permanently freely accessible to everyone worldwide, without any paywall, subscription, or registration requirement.</p></div>
        </div>
        {[['What is Open Access?','Open access (OA) publishing means that research articles are made freely available to the public immediately upon publication. Readers do not need to pay, subscribe, or register to access any content published in IJARST.'],['Our Open Access Model','IJARST operates under the Gold Open Access model. All costs associated with peer review, editorial processing, typesetting, and online hosting are covered by the Article Processing Charge (APC) of $33 USD, paid by authors upon acceptance. This enables unlimited free access for readers worldwide.'],['Creative Commons Licensing','All articles published in IJARST are licensed under the Creative Commons Attribution (CC BY) license. This allows anyone to share, adapt, and build upon the published work for any purpose, provided appropriate credit is given to the original authors.'],['Archiving & Long-Term Access','Published articles are deposited in Zenodo, Internet Archive, and other permanent repositories to ensure long-term preservation and continued open access, even in the unlikely event the journal ceases publication.'],['Author Rights','Authors retain the copyright to their published work under the CC BY license. They are free to share, post on personal/institutional websites, and deposit in any repository without restriction after publication.']].map(([title,text]) => (
          <div key={title} style={{marginBottom:32}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:700,marginBottom:10,paddingBottom:8,borderBottom:'2px solid #E8F5E9'}}>{title}</h2>
            <p style={{fontSize:15.5,color:'#444',lineHeight:1.8}}>{text}</p>
          </div>
        ))}
      </div></section>
    </>
  );
}
