// src/components/MobileMenu.jsx - Updated with user authentication
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, user, userRole, onLogout }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="mobile-menu-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      />
      <div 
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          padding: '60px 24px 24px',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          fontFamily: 'var(--font-sans)',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#1a1a1a',
            padding: '8px',
          }}
        >
          ✕
        </button>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Link 
            to="/" 
            onClick={onClose} 
            style={{ 
              textDecoration: 'none', 
              color: '#1a1a1a',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '8px 0',
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            onClick={onClose} 
            style={{ 
              textDecoration: 'none', 
              color: '#1a1a1a',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '8px 0',
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            About
          </Link>
          
          <Link 
            to="/donate" 
            onClick={onClose} 
            style={{ 
              textDecoration: 'none', 
              color: '#d32f2f',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '8px 0',
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            Support
          </Link>
          
          {user ? (
            <>
              {(userRole === 'admin' || userRole === 'editor') && (
                <Link 
                  to="/dashboard" 
                  onClick={onClose} 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#1a1a1a',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '8px 0',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  Dashboard
                </Link>
              )}
              
              <Link 
                to="/profile" 
                onClick={onClose} 
                style={{ 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                Profile
              </Link>
              
              {(userRole === 'admin' || userRole === 'editor') && (
                <Link 
                  to="/create-post" 
                  onClick={onClose} 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#2e7d32',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '8px 0',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  Write New Article
                </Link>
              )}
              
              <button 
                onClick={() => {
                  onClose();
                  onLogout();
                }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textAlign: 'left',
                  padding: '8px 0',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1a1a1a',
                  borderBottom: '1px solid #e0e0e0',
                  width: '100%'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={onClose} 
                style={{ 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                Login
              </Link>
              
              <Link 
                to="/signup" 
                onClick={onClose} 
                style={{ 
                  textDecoration: 'none', 
                  color: '#2e7d32',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                Subscribe
              </Link>
            </>
          )}
        </nav>
        
        {/* Optional: User info section */}
        {user && (
          <div style={{ 
            marginTop: '40px', 
            paddingTop: '20px', 
            borderTop: '2px solid #1a1a1a',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              {user.displayName || user.email}
            </div>
            <div style={{ textTransform: 'uppercase', fontSize: '10px' }}>
              {userRole?.toUpperCase()} ACCESS
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
