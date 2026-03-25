import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '100px', marginBottom: '100px' }}>
      <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="h-large" style={{ margin: 0, letterSpacing: '1px' }}>JOIN THE GAZETTE</h1>
          <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Support independent journalism and join our community of readers.
          </p>
        </header>

        {error && (
          <div style={{ 
            backgroundColor: '#fff5f5', 
            color: '#d32f2f', 
            padding: '12px', 
            fontSize: '11px', 
            fontWeight: 700, 
            fontFamily: 'var(--font-sans)', 
            marginBottom: '30px', 
            border: '1px solid #feb2b2',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="editor-field">
            <label className="editor-label">Full Name</label>
            <input
              className="editor-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="editor-field">
            <label className="editor-label">Email Address</label>
            <input
              className="editor-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@provider.com"
            />
          </div>
          
          <div className="grid-system" style={{ marginBottom: '40px' }}>
            <div style={{ gridColumn: 'span 6' }}>
              <label className="editor-label">Password</label>
              <input
                className="editor-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div style={{ gridColumn: 'span 6' }}>
              <label className="editor-label">Confirm Password</label>
              <input
                className="editor-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-heritage" style={{ width: '100%', marginBottom: '20px' }}>
            {loading ? 'CREATING ACCOUNT...' : 'JOIN NOW'}
          </button>
        </form>
        
        <footer style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid var(--silver-accent)', marginTop: '30px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#666', fontWeight: 600 }}>
            ALREADY A MEMBER? <Link to="/login" style={{ color: 'var(--text-ink)', textDecoration: 'underline' }}>SIGN IN TO YOUR ACCOUNT</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
