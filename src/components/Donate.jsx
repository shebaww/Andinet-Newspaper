// src/components/Donate.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import StripePayment from './StripePayment';
import Toast from './common/Toast';

const Donate = () => {
  const [amount, setAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'telebirr'
  const [showStripe, setShowStripe] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  const finalAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);

  const handlePaymentSuccess = async () => {
    setSuccess(true);
  };

  const handlePaymentError = (error) => {
    setToast({ message: error || 'Payment failed. Please try again.', type: 'error' });
    setShowStripe(false);
  };

  const handleStripeClick = () => {
    if (isNaN(finalAmount) || finalAmount < 1) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }
    setShowStripe(true);
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '700px', marginTop: '100px', marginBottom: '100px' }}>
        <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)', textAlign: 'center' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 className="h-large" style={{ margin: 0, letterSpacing: '1px' }}>THANK YOU</h1>
            <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '20px' }}>
              YOUR GENEROUS CONTRIBUTION HAS BEEN RECEIVED.
            </p>
          </header>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ margin: '20px 0', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
              The Andinet Gazette depends on supporters like you to keep local journalism alive.
            </p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn-heritage"
              style={{ textDecoration: 'none', marginTop: '20px' }}
            >
              RETURN TO FRONT PAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '100px', marginBottom: '100px' }}>
      <div style={{ padding: '60px', border: '1px solid var(--text-ink)', backgroundColor: 'white', boxShadow: '15px 15px 0px var(--silver-accent)' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="h-large" style={{ margin: 0, letterSpacing: '1px' }}>SUPPORT THE PRESS</h1>
          <p style={{ fontFamily: 'var(--font-main)', color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Every contribution makes a difference in independent journalism.
          </p>
        </header>

        {!showStripe ? (
          <>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '12px' }}>
                SELECT AMOUNT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                {['5', '10', '20'].map(val => (
                  <button 
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); setShowStripe(false); }}
                    style={{ 
                      padding: '12px',
                      background: amount === val && !showStripe ? '#1a1a1a' : '#fff',
                      color: amount === val && !showStripe ? '#fff' : '#1a1a1a',
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
              
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                  setShowStripe(false);
                }}
                min="1"
                step="1"
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

            <div style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', display: 'block', marginBottom: '12px' }}>
                PAYMENT METHOD
              </label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: paymentMethod === 'card' ? '#1a1a1a' : '#fff',
                    color: paymentMethod === 'card' ? '#fff' : '#1a1a1a',
                    border: '1px solid #1a1a1a',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  💳 Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('telebirr')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: paymentMethod === 'telebirr' ? '#1a1a1a' : '#fff',
                    color: paymentMethod === 'telebirr' ? '#fff' : '#1a1a1a',
                    border: '1px solid #1a1a1a',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📱 Telebirr
                </button>
              </div>
            </div>

            {paymentMethod === 'telebirr' && (
              <div style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: '#f9f9f9', 
                textAlign: 'center',
                border: '1px solid #e0e0e0'
              }}>
                <p style={{ marginBottom: '10px', fontWeight: 700 }}>Send payment via Telebirr:</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#2e7d32' }}>+251979087331</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  Include your email in the reference note for confirmation
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('+251979087331');
                    setToast({ message: 'Number copied to clipboard!', type: 'success' });
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #1a1a1a',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  COPY NUMBER
                </button>
              </div>
            )}

            {paymentMethod === 'card' && (
              <button 
                onClick={handleStripeClick}
                disabled={isNaN(finalAmount) || finalAmount < 1}
                className="btn-heritage"
                style={{ width: '100%', marginBottom: '20px' }}
              >
                CONTINUE TO PAYMENT
              </button>
            )}

            {paymentMethod === 'telebirr' && (
              <button 
                onClick={() => {
                  // Save telebirr donation as pending
                  addDoc(collection(db, 'donations'), {
                    amount: finalAmount,
                    userId: user?.uid || 'anonymous',
                    email: user?.email || 'anonymous',
                    paymentMethod: 'telebirr',
                    status: 'pending',
                    createdAt: serverTimestamp()
                  });
                  setToast({ message: 'Thank you! Please complete payment via Telebirr.', type: 'success' });
                  setTimeout(() => setSuccess(true), 2000);
                }}
                disabled={isNaN(finalAmount) || finalAmount < 1}
                className="btn-heritage"
                style={{ width: '100%', marginBottom: '20px' }}
              >
                CONFIRM TELEBIRR PAYMENT
              </button>
            )}
          </>
        ) : (
          <StripePayment 
            amount={finalAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        <footer style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid var(--silver-accent)', marginTop: '30px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#666', fontWeight: 600 }}>
            Secure payment processed by Stripe. All contributions support independent journalism.
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

export default Donate;
