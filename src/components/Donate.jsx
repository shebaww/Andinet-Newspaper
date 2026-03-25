import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Donate = () => {
  const [amount, setAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const finalAmount = amount === 'custom' ? customAmount : amount;
    
    // Simulate Stripe Checkout
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'donations'), {
          amount: parseFloat(finalAmount),
          userId: user?.uid || 'anonymous',
          email: user?.email || 'anonymous',
          createdAt: serverTimestamp(),
          status: 'completed'
        });
        setSuccess(true);
      } catch (error) {
        console.error('Error recording donation:', error);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="container">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h1 className="masthead" style={{ fontSize: '2rem', color: '#1a1a1a' }}>THANK YOU</h1>
          <p style={{ margin: '20px 0', fontSize: '1.2rem' }}>YOUR GENEROUS CONTRIBUTION HAS BEEN RECEIVED.</p>
          <p>The Andinet Gazette depends on supporters like you to keep local journalism alive.</p>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '30px' }}>
            RETURN TO FRONT PAGE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          SUPPORT THE PRESS
        </h1>
        
        <p style={{ marginBottom: '30px', lineHeight: '1.5' }}>
          Your donation helps us cover the costs of printing, equipment, and maintaining our digital presence. 
          Every contribution, no matter the size, makes a difference.
        </p>
        
        <form onSubmit={handleDonate}>
          <div className="form-group">
            <label>CHOOSE AN AMOUNT</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
              {['5', '10', '20'].map(val => (
                <button 
                  key={val}
                  type="button"
                  onClick={() => { setAmount(val); setCustomAmount(''); }}
                  style={{ 
                    background: amount === val ? '#1a1a1a' : '#fff',
                    color: amount === val ? '#fff' : '#1a1a1a',
                    border: '1px solid #1a1a1a'
                  }}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>OR ENTER CUSTOM AMOUNT</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount('custom');
              }}
              min="1"
            />
          </div>
          
          <button type="submit" disabled={loading || (amount === 'custom' && !customAmount)} style={{ width: '100%', marginTop: '20px' }}>
            {loading ? 'PROCESSING...' : `DONATE $${amount === 'custom' ? customAmount || '0' : amount}`}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px', color: '#666' }}>
          Secure payment processed by Stripe. 
          Contributions are not tax-deductible.
        </div>
      </div>
    </div>
  );
};

export default Donate;
