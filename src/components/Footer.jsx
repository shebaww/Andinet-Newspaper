import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" style={{ borderTop: '2px solid #1a1a1a', marginTop: '60px', padding: '40px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        <div>
          <h3 className="section-header" style={{ fontSize: '1.2rem' }}>THE ANDINET GAZETTE</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '10px' }}>
            The voice of our school since 2024. Dedicated to truth, community, and the art of local journalism.
          </p>
        </div>
        
        <div>
          <h4 className="section-header" style={{ fontSize: '1rem' }}>RESOURCES</h4>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', fontSize: '13px' }}>
            <li style={{ marginBottom: '5px' }}><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>OUR MISSION</Link></li>
            <li style={{ marginBottom: '5px' }}><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>CONTACT US</Link></li>
            <li style={{ marginBottom: '5px' }}><Link to="/donate" style={{ color: 'inherit', textDecoration: 'none' }}>SUPPORT THE PRESS</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="section-header" style={{ fontSize: '1rem' }}>MEMBERSHIP</h4>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', fontSize: '13px' }}>
            <li style={{ marginBottom: '5px' }}><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>LOGIN</Link></li>
            <li style={{ marginBottom: '5px' }}><Link to="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>JOIN THE CLUB</Link></li>
            <li style={{ marginBottom: '5px' }}><Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>DASHBOARD</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{ textAlign: 'center', marginTop: '40px', fontSize: '11px', color: '#666' }}>
        <p>© {new Date().getFullYear()} THE ANDINET GAZETTE. ALL RIGHTS RESERVED.</p>
        <p style={{ marginTop: '10px' }}>Made By Business Club.</p>
      </div>
    </footer>
  );
};

export default Footer;
