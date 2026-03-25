const Dialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid var(--text-ink)',
          boxShadow: '20px 20px 0px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', marginBottom: '15px' }}>{title}</h3>
        <p style={{ fontFamily: 'var(--font-main)', color: '#666', marginBottom: '30px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontFamily: 'var(--font-sans)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              fontSize: '12px', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              backgroundColor: 'var(--text-ink)', 
              color: 'white',
              padding: '10px 25px',
              fontFamily: 'var(--font-sans)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              fontSize: '12px', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
