// src/components/StripePayment.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import Toast from './common/Toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Checkout Form Component
const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      onError?.(submitError.message);
    } else {
      onSuccess?.();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '10px' }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%',
          padding: '14px',
          marginTop: '20px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          border: 'none',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '11px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1
        }}
      >
        {loading ? 'PROCESSING...' : `PAY $${amount}`}
      </button>
    </form>
  );
};

// Main Payment Component
const StripePayment = ({ amount, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const functions = getFunctions();
        const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
        
        const result = await createPaymentIntent({ amount });
        setClientSecret(result.data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        onError?.(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, onError]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Preparing secure payment...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
        <p>Unable to process payment. Please try again.</p>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1a1a1a',
      colorBackground: '#ffffff',
      colorText: '#1a1a1a',
      fontFamily: 'var(--font-sans)',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default StripePayment;
