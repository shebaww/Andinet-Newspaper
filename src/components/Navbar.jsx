// src/components/Navbar.jsx - Updated with mobile menu
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReadingProgress from './ReadingProgress';
import Dialog from './common/Dialog';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSlim, setIsSlim] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        padding: isSlim ? '8px 0' : 'clamp(12px, 3vw, 15px) 0', // Responsive padding
        zIndex: 1000
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 20px)', // Responsive horizontal padding
          display: 'flex',
          alignItems: 'center', // Changed from baseline for better mobile alignment
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px' // Added gap for mobile
        }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            fontFamily: 'var(--font-logo)', 
            fontSize: isSlim ? 'clamp(18px, 5vw, 22px)' : 'clamp(20px, 6vw, 22px)', // Responsive font
            fontWeight: 800, 
            letterSpacing: '-0.3px',
            color: '#1a1a1a',
            whiteSpace: 'nowrap' // Prevent logo from wrapping
          }}>
           The Andinet
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="nav-links desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 24px)', // Responsive gap
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }}>
            {/* Always visible for everyone */}
            <li>
              <Link to="/" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(10px, 2.5vw, 11px)', // Responsive font
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#1a1a1a',
                whiteSpace: 'nowrap'
              }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(10px, 2.5vw, 11px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#1a1a1a',
                whiteSpace: 'nowrap'
              }}>
                About
              </Link>
            </li>
            <li>
              <Link to="/puzzle" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(10px, 2.5vw, 11px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#1a1a1a',
                whiteSpace: 'nowrap'
              }}>
                Puzzles
              </Link>
            </li>
            <li>
              <Link to="/donate" className="nav-link" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(10px, 2.5vw, 11px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#d32f2f',
                whiteSpace: 'nowrap'
              }}>
                Support
              </Link>
            </li>
            
            {user ? (
              <>
                {/* Dashboard - Only for admin and editor */}
                {(userRole === 'admin' || userRole === 'editor') && (
                  <li>
                    <Link to="/dashboard" className="nav-link" style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(10px, 2.5vw, 11px)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textDecoration: 'none',
                      color: '#1a1a1a',
                      whiteSpace: 'nowrap'
                    }}>
                      Dashboard
                    </Link>
                  </li>
                )}
                
                {/* Profile - Visible to all logged-in users */}
                <li>
                  <Link to="/profile" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    whiteSpace: 'nowrap'
                  }}>
                    Profile
                  </Link>
                </li>
                
                {/* Create Post - Only for admin and editor */}
                {(userRole === 'admin' || userRole === 'editor') && (
                  <li>
                    <Link to="/create-post" className="nav-link" style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(10px, 2.5vw, 11px)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textDecoration: 'none',
                      color: '#2e7d32',
                      whiteSpace: 'nowrap'
                    }}>
                      Write
                    </Link>
                  </li>
                )}
                
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
                      fontSize: 'clamp(10px, 2.5vw, 11px)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#1a1a1a',
                      whiteSpace: 'nowrap'
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
                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    whiteSpace: 'nowrap'
                  }}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="nav-link" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    color: '#2e7d32',
                    whiteSpace: 'nowrap'
                  }}>
                    Subscribe
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="mobile-menu-button"
            aria-label="Open menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'clamp(40px, 10vw, 56px)', // Even larger
              padding: '8px',
              color: '#1a1a1a',
              lineHeight: 1,
              minWidth: '44px', // Better touch target
              minHeight: '44px' // Better touch target
            }}
          >
            ☰
          </button>
        </div>
        {isPostPage && <ReadingProgress />}
      </nav>

      {/* Spacer with responsive height */}
      <div style={{ height: isSlim ? 'clamp(50px, 12vh, 70px)' : 'clamp(60px, 15vh, 80px)' }} />

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        userRole={userRole}
        onLogout={() => setLogoutDialogOpen(true)}
      />

      <Dialog 
        isOpen={logoutDialogOpen}
        title="Sign Out"
        message="Are you sure you wish to end your current session and sign out of The Andinet Gazette?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
        confirmText="Sign Out"
        cancelText="Remain Signed In"
      />

      {/* Enhanced responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
        
        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          .nav-link,
          .mobile-menu-button {
            min-height: 44px;
            min-width: 44px;
            display: inline-flex;
            align-items: center;
          }
        }
        
        /* Handle very small screens */
        @media (max-width: 480px) {
          .container {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
