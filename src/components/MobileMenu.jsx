// src/components/MobileMenu.jsx - Enhanced with better mobile UX
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const MobileMenu = ({ isOpen, onClose, user, userRole, onLogout }) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          animation: 'fadeIn 0.3s ease',
        }}
      />
      <div 
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(85%, 320px)', // Responsive width: 85% on small screens, max 320px
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          padding: 'clamp(48px, 15vh, 60px) clamp(20px, 5vw, 24px) clamp(24px, 5vw, 24px)', // Responsive padding
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          fontFamily: 'var(--font-sans)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: 'clamp(16px, 4vh, 20px)', // Responsive positioning
            right: 'clamp(16px, 4vw, 20px)',
            background: 'none',
            border: 'none',
            fontSize: 'clamp(24px, 6vw, 28px)', // Responsive font
            cursor: 'pointer',
            color: '#1a1a1a',
            padding: '12px', // Larger touch target
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>
        
        <nav style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'clamp(16px, 4vh, 24px)', // Responsive gap
          flex: 1
        }}>
          <Link 
            to="/" 
            onClick={onClose} 
            style={{ 
              textDecoration: 'none', 
              color: '#1a1a1a',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px, 4.5vw, 18px)', // Responsive font
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '12px 0', // Larger touch target
              borderBottom: '1px solid #e0e0e0',
              transition: 'color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
              fontSize: 'clamp(16px, 4.5vw, 18px)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '12px 0',
              borderBottom: '1px solid #e0e0e0',
              transition: 'color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
              fontSize: 'clamp(16px, 4.5vw, 18px)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '12px 0',
              borderBottom: '1px solid #e0e0e0',
              transition: 'opacity 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
                    fontSize: 'clamp(16px, 4.5vw, 18px)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '12px 0',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'color 0.2s',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
                  fontSize: 'clamp(16px, 4.5vw, 18px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0e0e0',
                  transition: 'color 0.2s',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
                    fontSize: 'clamp(16px, 4.5vw, 18px)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '12px 0',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'opacity 0.2s',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
                  padding: '12px 0',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(16px, 4.5vw, 18px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1a1a1a',
                  borderBottom: '1px solid #e0e0e0',
                  width: '100%',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
                  fontSize: 'clamp(16px, 4.5vw, 18px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0e0e0',
                  transition: 'color 0.2s',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
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
                  fontSize: 'clamp(16px, 4.5vw, 18px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0e0e0',
                  transition: 'opacity 0.2s',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Subscribe
              </Link>
            </>
          )}
        </nav>
        
        {/* Optional: User info section with responsive styling */}
        {user && (
          <div style={{ 
            marginTop: 'auto', // Push to bottom
            paddingTop: 'clamp(24px, 5vh, 40px)', 
            marginBottom: 'clamp(16px, 3vh, 20px)',
            borderTop: '2px solid #1a1a1a',
            fontSize: 'clamp(11px, 3vw, 12px)',
            color: '#666'
          }}>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: '6px',
              wordBreak: 'break-word' // Handle long emails
            }}>
              {user.displayName || user.email}
            </div>
            <div style={{ 
              textTransform: 'uppercase', 
              fontSize: 'clamp(9px, 2.5vw, 10px)',
              letterSpacing: '0.5px'
            }}>
              {userRole?.toUpperCase()} ACCESS
            </div>
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Smooth scroll for menu */
        .mobile-menu {
          scrollbar-width: thin;
        }
        
        .mobile-menu::-webkit-scrollbar {
          width: 4px;
        }
        
        .mobile-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .mobile-menu::-webkit-scrollbar-thumb {
          background: #888;
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
