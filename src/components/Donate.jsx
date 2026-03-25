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
      <div className="user-manager" style={{ margin: '0 auto',  maxWidth: '500px  !important', wordWrap: 'break-word', padding: '0 20px' }}>
        <header style={{ marginBottom: '30px', width: '100% !important', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
          <h2 className="h-large" style={{ margin: 0, textAlign: 'center' }}>THANK YOU</h2>
          <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Your generosity sustains independent journalism
          </p>
        </header>
        
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ margin: '20px 0', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
            YOUR GENEROUS CONTRIBUTION HAS BEEN RECEIVED.
          </p>
          <p style={{ color: '#666', marginBottom: '30px', fontFamily: 'var(--font-serif)' }}>
            The Andinet Gazette depends on supporters like you to keep local journalism alive.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            RETURN TO FRONT PAGE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-manager" style={{ marginTop: '40px' }}>
      <header style={{ marginBottom: '30px', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
        <h2 className="h-large" style={{ margin: 0 }}>SUPPORT THE PRESS</h2>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Every contribution makes a difference
        </p>
      </header>
      
      <div className="grid-system">
        <div style={{ gridColumn: 'span 12' }}>
          <p style={{ marginBottom: '30px', lineHeight: '1.6', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>
            Your donation helps us cover the costs of printing, equipment, and maintaining our digital presence. 
            Every contribution, no matter the size, makes a difference.
          </p>
          
          <form onSubmit={handleDonate}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '12px' }}>
                CHOOSE AN AMOUNT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['5', '10', '20'].map(val => (
                  <button 
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                    style={{ 
                      padding: '12px',
                      background: amount === val ? '#1a1a1a' : '#fff',
                      color: amount === val ? '#fff' : '#1a1a1a',
                      border: '1px solid #1a1a1a',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '12px' }}>
                OR ENTER CUSTOM AMOUNT
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: 'none',
                  borderBottom: '1px solid #1a1a1a',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || (amount === 'custom' && !customAmount)} 
              style={{ 
                width: '100%', 
                padding: '14px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '11px',
                cursor: (loading || (amount === 'custom' && !customAmount)) ? 'not-allowed' : 'pointer',
                opacity: (loading || (amount === 'custom' && !customAmount)) ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              {loading ? 'PROCESSING...' : `DONATE $${amount === 'custom' ? (customAmount || '0') : amount}`}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px', fontFamily: 'var(--font-sans)', color: '#666', borderTop: '1px solid var(--silver-accent)', paddingTop: '20px' }}>
            Secure payment processed by Stripe. 
            Contributions are not tax-deductible.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
