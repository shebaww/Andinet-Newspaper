// src/components/common/Pagination.jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '40px',
      padding: '20px 0'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-heritage"
        style={{ padding: '8px 16px' }}
      >
        ← Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === page ? 'var(--text-ink)' : 'white',
            color: currentPage === page ? 'white' : 'var(--text-ink)',
            border: '1px solid var(--text-ink)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '12px'
          }}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-heritage"
        style={{ padding: '8px 16px' }}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
