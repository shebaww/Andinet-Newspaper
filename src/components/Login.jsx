import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          LOGIN
        </h1>
        
        {error && <div className="alert alert-error" style={{ color: '#d32f2f', marginBottom: '20px', fontSize: '12px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%', marginBottom: '15px' }}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading} 
          style={{ width: '100%', marginBottom: '20px' }}
        >
          CONTINUE WITH GOOGLE
        </button>
        
        <hr />
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/signup" className="nav-link" style={{ fontSize: '11px' }}>
            NOT A SUBSCRIBER? JOIN TODAY
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
