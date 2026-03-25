const About = () => {
  return (
    <div className="user-manager" style={{ margin: '0 auto', maxWidth: '900px' }}>
      <header style={{ margin: '30px 0px', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
        <h2 className="h-large" style={{ margin: 0 }}>OUR MISSION</h2>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Founded 2024 • Student-Led Publication
        </p>
      </header>
      
      <div className="grid-system">
        <div style={{ gridColumn: 'span 12' }}>
          <p style={{ lineHeight: '1.6', marginBottom: '30px', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
            The Andinet Gazette is a student-led publication dedicated to providing accurate, 
            timely, and relevant news to our school community. Founded in 2024, our mission is to 
            foster transparency, encourage critical thinking, and provide a platform for student voices.
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              marginBottom: '15px',
              borderBottom: '1px solid var(--silver-accent)',
              paddingBottom: '8px'
            }}>
              THE EDITORIAL BOARD
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', borderBottom: '1px dotted #eee', paddingBottom: '8px' }}>
                <strong style={{ fontFamily: 'var(--font-sans)' }}>Editor-in-Chief:</strong>
                <span style={{ color: '#666' }}>Student Name</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', borderBottom: '1px dotted #eee', paddingBottom: '8px' }}>
                <strong style={{ fontFamily: 'var(--font-sans)' }}>Managing Editor:</strong>
                <span style={{ color: '#666' }}>Student Name</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', borderBottom: '1px dotted #eee', paddingBottom: '8px' }}>
                <strong style={{ fontFamily: 'var(--font-sans)' }}>Faculty Advisor:</strong>
                <span style={{ color: '#666' }}>Mr./Ms. Advisor Name</span>
              </li>
            </ul>
          </div>

          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#f9f9f9', 
            borderLeft: '3px solid #1a1a1a',
            fontStyle: 'italic'
          }}>
            <p style={{ margin: 0, fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
              Interested in joining the staff? Sign up for an account and contact an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
