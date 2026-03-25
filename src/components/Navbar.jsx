import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReadingProgress from './ReadingProgress';
import Dialog from './common/Dialog';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSlim, setIsSlim] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSlim(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isPostPage = location.pathname.startsWith('/post/');

  return (
    <>
      <nav className={`navbar ${isSlim ? 'slim' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: 'var(--border-double)',
        transition: 'all 0.2s ease',
        padding: isSlim ? '8px 0' : '15px 0',
        zIndex: 1000
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            fontFamily: 'var(--font-logo)', 
            fontSize: isSlim ? '18px' : '22px', 
            fontWeight: 800, 
            letterSpacing: '-0.3px',
            color: '#1a1a1a'
          }}>
           The Andinet
          </Link>
          
          <ul className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }}>
            <li>
              <Link to="/" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#1a1a1a'
              }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#1a1a1a'
              }}>
                About
              </Link>
            </li>
            <li>
              <Link to="/donate" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#d32f2f'
              }}>
                Support
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#1a1a1a'
                  }}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#1a1a1a'
                  }}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setLogoutDialogOpen(true)} 
                    className="nav-link" 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#1a1a1a'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#1a1a1a'
                  }}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#2e7d32'
                  }}>
                    Subscribe
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {isPostPage && <ReadingProgress />}
      </nav>

      <div style={{ height: isSlim ? '50px' : '70px' }} />

      <Dialog 
        isOpen={logoutDialogOpen}
        title="Sign Out"
        message="Are you sure you wish to end your current session and sign out of The Andinet Gazette?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
        confirmText="Sign Out"
        cancelText="Remain Signed In"
      />
    </>
  );
};

export default Navbar;
