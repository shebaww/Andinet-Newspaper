// Contact.jsx
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Toast from './common/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const functions = getFunctions();
      const sendContactEmail = httpsCallable(functions, 'sendContactEmail');
      
      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ maxWidth: '700px', marginTop: '100px', marginBottom: '100px' }}>
        <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)', textAlign: 'center' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 className="h-large" style={{ margin: 0, letterSpacing: '1px' }}>MESSAGE SENT</h1>
            <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '20px' }}>
              YOUR CORRESPONDENCE HAS BEEN RECEIVED. WE WILL RESPOND SHORTLY.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '100px', marginBottom: '100px' }}>
      <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="h-large" style={{ margin: 0, letterSpacing: '1px' }}>CONTACT US</h1>
          <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Have questions, feedback, or story tips? We'd love to hear from you.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="editor-field">
            <label className="editor-label">Your Name</label>
            <input
              className="editor-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="editor-field">
            <label className="editor-label">Your Email</label>
            <input
              className="editor-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="name@provider.com"
            />
          </div>
          
          <div className="editor-field" style={{ marginBottom: '40px' }}>
            <label className="editor-label">Your Message</label>
            <textarea
              className="editor-input"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows="5"
              placeholder="Please share your thoughts, questions, or feedback..."
              style={{ resize: 'vertical', fontFamily: 'var(--font-main)' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-heritage" 
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
        
        <footer style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid var(--silver-accent)', marginTop: '30px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#666', fontWeight: 600 }}>
            FOR URGENT MATTERS: <span style={{ color: 'var(--text-ink)', fontWeight: 'bold' }}>newsroom@andinet-gazette.org</span>
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

export default Contact;
