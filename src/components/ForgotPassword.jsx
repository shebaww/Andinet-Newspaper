// src/components/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Toast from './common/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setToast({ 
        message: 'Password reset email sent! Check your inbox.', 
        type: 'success' 
      });
      setEmail('');
    } catch (error) {
      console.error('Reset error:', error);
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '100px', marginBottom: '100px' }}>
      <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="h-large" style={{ margin: 0 }}>RESET PASSWORD</h1>
          <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
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
          
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-heritage" 
            style={{ width: '100%', marginBottom: '20px', marginTop: '20px' }}
          >
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
        </form>
        
        <footer style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid var(--silver-accent)', marginTop: '30px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#666' }}>
            <Link to="/login" style={{ color: 'var(--text-ink)', textDecoration: 'underline' }}>
              BACK TO SIGN IN
            </Link>
          </p>
        </footer>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onDismiss={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default ForgotPassword;
