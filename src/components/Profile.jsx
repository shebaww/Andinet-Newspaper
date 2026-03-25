import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!userProfile) return <div>No user profile found.</div>;

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          USER PROFILE
        </h1>
        
        <div className="profile-info">
          <div className="form-group">
            <label>NAME</label>
            <p>{userProfile.displayName}</p>
          </div>
          
          <div className="form-group">
            <label>EMAIL</label>
            <p>{userProfile.email}</p>
          </div>
          
          <div className="form-group">
            <label>ROLE</label>
            <p style={{ textTransform: 'uppercase' }}>{userProfile.role}</p>
          </div>
          
          <div className="form-group">
            <label>JOINED</label>
            <p>{new Date(userProfile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
