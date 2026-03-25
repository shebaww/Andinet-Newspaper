import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for transition
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const bgColor = type === 'success' ? '#2e7d32' : '#d32f2f';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: bgColor,
        color: 'white',
        padding: '12px 24px',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        zIndex: 2000,
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
