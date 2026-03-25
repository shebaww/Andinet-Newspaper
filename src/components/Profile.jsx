import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile, loading } = useAuth();

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-header)' }}>
      LOADING PROFILE...
    </div>
  );
  
  if (!userProfile) return (
    <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-sans)' }}>
      No user profile found.
    </div>
  );

  return (
    <div style={{ height: '100vh', maxWidth: '1000px',margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div className="user-manager" style={{  width: '100%', }}>
      <header style={{ marginBottom: '30px', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
        <h2 className="h-large" style={{ margin: 0 }}>USER PROFILE</h2>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Personnel record • Confidential
        </p>
      </header>

      <div className="grid-system" style={{ marginBottom: '30px' }}>
        <div style={{ gridColumn: 'span 12' }}>
          <div className="profile-info">
            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--silver-accent)' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '8px' }}>
                NAME
              </label>
              <p style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-sans)', margin: 0 }}>
                {userProfile.displayName || 'Unnamed Correspondent'}
              </p>
            </div>
            
            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--silver-accent)' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '8px' }}>
                EMAIL
              </label>
              <p style={{ fontSize: '16px', fontFamily: 'var(--font-sans)', margin: 0, color: '#666' }}>
                {userProfile.email}
              </p>
            </div>
            
            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--silver-accent)' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '8px' }}>
                ROLE
              </label>
              <p style={{ margin: 0 }}>
                <span style={{ 
                  padding: '4px 12px', 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  backgroundColor: userProfile.role === 'admin' ? '#111' : userProfile.role === 'editor' ? '#ABB0AC' : '#f0f0f0',
                  color: userProfile.role === 'admin' ? 'white' : 'black',
                  borderRadius: '2px'
                }}>
                  {userProfile.role}
                </span>
              </p>
            </div>
            
            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--silver-accent)' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '8px' }}>
                JOINED
              </label>
              <p style={{ fontSize: '14px', fontFamily: 'var(--font-sans)', margin: 0, color: '#666' }}>
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
