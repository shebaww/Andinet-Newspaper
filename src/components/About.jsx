const About = () => {
  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          OUR MISSION
        </h1>
        
        <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
          The Andinet Gazette is a student-led publication dedicated to providing accurate, 
          timely, and relevant news to our school community. Founded in 2024, our mission is to 
          foster transparency, encourage critical thinking, and provide a platform for student voices.
        </p>
        
        <h2 className="section-header">THE EDITORIAL BOARD</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          <li style={{ marginBottom: '10px' }}><strong>Editor-in-Chief:</strong> Student Name</li>
          <li style={{ marginBottom: '10px' }}><strong>Managing Editor:</strong> Student Name</li>
          <li style={{ marginBottom: '10px' }}><strong>Faculty Advisor:</strong> Mr./Ms. Advisor Name</li>
        </ul>

        <p style={{ marginTop: '30px', fontStyle: 'italic', fontSize: '12px' }}>
          Interested in joining the staff? Sign up for an account and contact an administrator.
        </p>
      </div>
    </div>
  );
};

export default About;
