import React from 'react';

const EIC = {
  name: 'Prof. Jonathan R. Hartley',
  title: 'Professor of Electrical Engineering',
  affiliation: 'University of Surrey, Guildford, UK',
  country: '🇬🇧',
  specialization: 'Signal Processing, Embedded Systems, Smart Grid Technologies',
  role: 'Editor-in-Chief',
};

const associateEditors = [
  { name: 'Dr. Amara N. Osei', title: 'Associate Professor', affiliation: 'Kwame Nkrumah University of Science and Technology, Ghana', country: '🇬🇭', specialization: 'Biomedical Engineering, Medical Imaging' },
  { name: 'Dr. Maria T. Vasquez', title: 'Senior Lecturer', affiliation: 'Universidad Politécnica de Madrid, Spain', country: '🇪🇸', specialization: 'Renewable Energy Systems, Power Electronics' },
  { name: 'Dr. Liang Wei Chen', title: 'Associate Professor', affiliation: 'National Taiwan University of Science and Technology', country: '🇹🇼', specialization: 'Artificial Intelligence, Machine Learning, NLP' },
  { name: 'Dr. Fatima Al-Rashidi', title: 'Assistant Professor', affiliation: 'King Abdullah University of Science and Technology, Saudi Arabia', country: '🇸🇦', specialization: 'Materials Science, Nanotechnology' },
];

const boardMembers = [
  { name: 'Dr. Priya S. Menon', title: 'Assistant Professor', affiliation: 'Indian Institute of Technology Delhi, India', country: '🇮🇳', specialization: 'Environmental Engineering, Water Treatment' },
  { name: 'Dr. Oluwaseun A. Adeyemi', title: 'Lecturer', affiliation: 'University of Lagos, Nigeria', country: '🇳🇬', specialization: 'Civil & Structural Engineering' },
  { name: 'Dr. Elena V. Sorokina', title: 'Senior Researcher', affiliation: 'Moscow Institute of Physics and Technology, Russia', country: '🇷🇺', specialization: 'Applied Mathematics, Computational Mechanics' },
  { name: 'Dr. Ricardo Almeida Fonseca', title: 'Professor', affiliation: 'Universidade de São Paulo, Brazil', country: '🇧🇷', specialization: 'Chemical Engineering, Process Optimization' },
  { name: 'Dr. Yuki Tanaka', title: 'Associate Professor', affiliation: 'Osaka Metropolitan University, Japan', country: '🇯🇵', specialization: 'Robotics, Control Systems, Mechatronics' },
  { name: 'Dr. Sophia J. Müller', title: 'Researcher', affiliation: 'Technical University of Munich, Germany', country: '🇩🇪', specialization: 'Internet of Things, Wireless Sensor Networks' },
  { name: 'Dr. Ahmed K. Benali', title: 'Associate Professor', affiliation: 'University of Science and Technology Houari Boumediene, Algeria', country: '🇩🇿', specialization: 'Computer Vision, Deep Learning' },
  { name: 'Dr. Grace E. Thornton', title: 'Senior Lecturer', affiliation: 'University of Cape Town, South Africa', country: '🇿🇦', specialization: 'Electrical Power Systems, Energy Policy' },
];

const secretary = {
  name: 'Ms. Claire H. Watson',
  title: 'Editorial Secretary',
  affiliation: 'IJARST Editorial Office, United Kingdom',
  country: '🇬🇧',
  specialization: 'Manuscript Management, Author Communications',
  contact: 'ijarstjournal@gmail.com',
};

function MemberCard({ member, highlighted }) {
  return (
    <div style={{ background: highlighted ? '#0D0D0D' : '#fff', border: highlighted ? '2px solid #F5C400' : '1px solid #E0E0E0', borderRadius: 10, padding: '24px', transition: 'all 0.22s', borderTop: highlighted ? '4px solid #F5C400' : '3px solid #1B5E20' }}
      onMouseEnter={e => { if (!highlighted) { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: highlighted ? '#F5C400' : '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {member.country}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: highlighted ? '#F5C400' : '#1B5E20', marginBottom: 4 }}>{member.role || 'Editorial Board Member'}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: highlighted ? '#FAFAFA' : '#0D0D0D', marginBottom: 3 }}>{member.name}</h3>
          <div style={{ fontSize: 13.5, color: highlighted ? '#CCCCCC' : '#555', marginBottom: 3 }}>{member.title}</div>
          <div style={{ fontSize: 13, color: highlighted ? '#888' : '#888', marginBottom: 8 }}>{member.affiliation}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {member.specialization.split(', ').map(s => (
              <span key={s} style={{ fontSize: 11.5, background: highlighted ? 'rgba(245,196,0,0.12)' : '#E8F5E9', color: highlighted ? '#F5C400' : '#1B5E20', border: `1px solid ${highlighted ? 'rgba(245,196,0,0.3)' : '#A5D6A7'}`, padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
          {member.contact && <a href={`mailto:${member.contact}`} style={{ fontSize: 13, color: '#F5C400', marginTop: 8, display: 'block' }}>{member.contact}</a>}
        </div>
      </div>
    </div>
  );
}

export default function EditorialBoard() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(245,196,0,0.15)', color: '#F5C400' }}>Team</span>
          <h1>Editorial Board</h1>
          <p>Our international team of expert scholars ensuring the highest publication standards.</p>
        </div>
      </div>
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          {/* Editor-in-Chief */}
          <span className="section-badge">Editor-in-Chief</span>
          <div style={{ marginBottom: 48 }}>
            <MemberCard member={{ ...EIC, role: 'Editor-in-Chief' }} highlighted={true} />
          </div>

          {/* Associate Editors */}
          <span className="section-badge">Associate Editors</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 48, marginTop: 8 }}>
            {associateEditors.map(m => <MemberCard key={m.name} member={{ ...m, role: 'Associate Editor' }} />)}
          </div>

          {/* Board Members */}
          <span className="section-badge">Editorial Board Members</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 48, marginTop: 8 }}>
            {boardMembers.map(m => <MemberCard key={m.name} member={m} />)}
          </div>

          {/* Secretary */}
          <span className="section-badge">Editorial Office</span>
          <div style={{ marginTop: 8, maxWidth: 480 }}>
            <MemberCard member={{ ...secretary, role: 'Editorial Secretary' }} />
          </div>
        </div>
      </section>
    </>
  );
}
