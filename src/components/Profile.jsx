import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile, loading } = useAuth();

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: 'clamp(60px, 20vh, 100px) clamp(20px, 5vw, 40px)', 
      fontFamily: 'var(--font-header)',
      fontSize: 'clamp(12px, 4vw, 14px)'
    }}>
      LOADING PROFILE...
    </div>
  );
  
  if (!userProfile) return (
    <div style={{ 
      textAlign: 'center', 
      padding: 'clamp(60px, 20vh, 100px) clamp(20px, 5vw, 40px)', 
      fontFamily: 'var(--font-sans)',
      fontSize: 'clamp(14px, 4vw, 16px)'
    }}>
      No user profile found.
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', // Changed from fixed height
      maxWidth: '1000px',
      margin: '0 auto', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'clamp(20px, 5vh, 40px) clamp(16px, 4vw, 20px)' // Added responsive padding
    }}>
      <div className="user-manager" style={{ width: '100%' }}>
        <header style={{ 
          marginBottom: 'clamp(20px, 5vh, 30px)', 
          borderBottom: 'var(--border-double)', 
          paddingBottom: 'clamp(15px, 3vw, 20px)' 
        }}>
          <h2 className="h-large" style={{ 
            margin: 0,
            fontSize: 'clamp(24px, 6vw, 36px)' // Responsive header
          }}>
            USER PROFILE
          </h2>
          <p style={{ 
            fontSize: 'clamp(10px, 3vw, 11px)', 
            fontFamily: 'var(--font-sans)', 
            color: '#666', 
            marginTop: '5px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            wordBreak: 'break-word' // Handle long text on mobile
          }}>
            Personnel record • Confidential
          </p>
        </header>

        <div className="grid-system" style={{ marginBottom: 'clamp(20px, 5vh, 30px)' }}>
          <div style={{ gridColumn: 'span 12' }}>
            <div className="profile-info">
              <div style={{ 
                marginBottom: 'clamp(20px, 4vh, 25px)', 
                paddingBottom: 'clamp(12px, 2vw, 15px)', 
                borderBottom: '1px solid var(--silver-accent)' 
              }}>
                <label style={{ 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: '#666', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}>
                  NAME
                </label>
                <p style={{ 
                  fontSize: 'clamp(16px, 5vw, 18px)', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-sans)', 
                  margin: 0,
                  wordBreak: 'break-word' // Handle long names
                }}>
                  {userProfile.displayName || 'Unnamed Correspondent'}
                </p>
              </div>
              
              <div style={{ 
                marginBottom: 'clamp(20px, 4vh, 25px)', 
                paddingBottom: 'clamp(12px, 2vw, 15px)', 
                borderBottom: '1px solid var(--silver-accent)' 
              }}>
                <label style={{ 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: '#666', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}>
                  EMAIL
                </label>
                <p style={{ 
                  fontSize: 'clamp(14px, 4vw, 16px)', 
                  fontFamily: 'var(--font-sans)', 
                  margin: 0, 
                  color: '#666',
                  wordBreak: 'break-word' // Handle long emails
                }}>
                  {userProfile.email}
                </p>
              </div>
              
              <div style={{ 
                marginBottom: 'clamp(20px, 4vh, 25px)', 
                paddingBottom: 'clamp(12px, 2vw, 15px)', 
                borderBottom: '1px solid var(--silver-accent)' 
              }}>
                <label style={{ 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: '#666', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}>
                  ROLE
                </label>
                <p style={{ margin: 0 }}>
                  <span style={{ 
                    padding: 'clamp(4px, 1.5vw, 6px) clamp(10px, 3vw, 12px)', 
                    fontSize: 'clamp(10px, 3vw, 11px)', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    backgroundColor: userProfile.role === 'admin' ? '#111' : userProfile.role === 'editor' ? '#ABB0AC' : '#f0f0f0',
                    color: userProfile.role === 'admin' ? 'white' : 'black',
                    borderRadius: '2px',
                    display: 'inline-block' // Ensure proper wrapping
                  }}>
                    {userProfile.role}
                  </span>
                </p>
              </div>
              
              <div style={{ 
                marginBottom: 'clamp(20px, 4vh, 25px)', 
                paddingBottom: 'clamp(12px, 2vw, 15px)', 
                borderBottom: '1px solid var(--silver-accent)' 
              }}>
                <label style={{ 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: '#666', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}>
                  JOINED
                </label>
                <p style={{ 
                  fontSize: 'clamp(12px, 3.5vw, 14px)', 
                  fontFamily: 'var(--font-sans)', 
                  margin: 0, 
                  color: '#666' 
                }}>
                  {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
