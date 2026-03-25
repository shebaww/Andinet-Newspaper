import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send to an API or Firestore
    console.log('Contact form:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h1 className="masthead" style={{ fontSize: '2rem' }}>MESSAGE SENT</h1>
          <p style={{ marginTop: '20px' }}>YOUR CORRESPONDENCE HAS BEEN RECEIVED. WE WILL RESPOND SHORTLY.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          CONTACT US
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>YOUR NAME</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>YOUR EMAIL</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>YOUR MESSAGE</label>
            <textarea 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required 
              rows="5"
            />
          </div>
          
          <button type="submit" style={{ width: '100%' }}>SEND MESSAGE</button>
        </form>
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px' }}>FOR URGENT MATTERS: newsroom@andinet-gazette.org</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
