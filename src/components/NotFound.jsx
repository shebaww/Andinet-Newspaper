// Create new file: src/components/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center',
      padding: '50px 20px'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0, fontFamily: 'var(--font-header)' }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-header)', marginTop: 0 }}>Page Not Found</h2>
      <p style={{ fontFamily: 'var(--font-main)', marginBottom: '30px' }}>
        The article or page you're looking for doesn't exist in our archives.
      </p>
      <Link to="/" className="btn-heritage" style={{ textDecoration: 'none' }}>
        Return to Front Page
      </Link>
    </div>
  );
};

export default NotFound;
