import { useState, useEffect } from 'react';
import { commentLimiter } from '../utils/rateLimiter';
import { sanitizeInput } from '../utils/sanitize';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Toast from './common/Toast';
import Dialog from './common/Dialog';

const CommentSection = ({ postId }) => {
  const { user, userProfile, userRole } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return unsubscribe;
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    
    // Rate limiting check
  const userKey = `comment_${user.uid}`;
  if (!commentLimiter.check(userKey)) {
    setToast({ 
      message: 'Too many comments. Please wait a moment before posting again.', 
      type: 'error' 
    });
    return;
  }

    const commentContent = sanitizeInput(newComment.trim()); // Sanitize comment
    
    setNewComment('');
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticComment = {
      id: tempId,
      postId,
      content: commentContent,
      authorId: user.uid,
      authorName: sanitizeInput(userProfile?.displayName || user.email.split('@')[0]),
      createdAt: { toDate: () => new Date() },
      isOptimistic: true
    };
    
    setComments(prev => [optimisticComment, ...prev]);

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        content: commentContent,
        authorId: user.uid,
        authorName: sanitizeInput(userProfile?.displayName || user.email.split('@')[0]),
        createdAt: serverTimestamp()
      });
      setToast({ message: 'Correspondence published successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewComment(newComment.trim());
      setToast({ message: 'Failed to publish correspondence', type: 'error' });
    }
  };

  const confirmDelete = (id) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    setDeleteDialogOpen(false);
    try {
      await deleteDoc(doc(db, 'comments', commentToDelete));
      setToast({ message: 'Correspondence removed', type: 'success' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      setToast({ message: 'Failed to remove correspondence', type: 'error' });
    } finally {
      setCommentToDelete(null);
    }
  };

  return (
    <div className="comment-section" style={{ marginTop: '30px' }}>
      <h3 className="section-header" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '1px', marginBottom: '20px' }}>
        CORRESPONDENCE ({comments.length})
      </h3>
      
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the conversation..."
              required
              rows="4"
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontFamily: 'var(--font-main)', 
                fontSize: '1rem',
                border: '1px solid var(--silver-accent)',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--text-ink)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--silver-accent)'}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !newComment.trim()}
            className="btn-heritage"
            style={{ width: 'auto' }}
          >
            {loading ? 'POSTING...' : 'SEND CORRESPONDENCE'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '30px', border: '1px solid var(--silver-accent)', backgroundColor: '#f9f9f9' }}>
          <p style={{ fontSize: '14px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            PLEASE <a href="/login" style={{ color: 'var(--text-ink)', textDecoration: 'underline' }}>LOGIN</a> TO JOIN THE CONVERSATION.
          </p>
        </div>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            style={{ 
              borderBottom: 'var(--hairline)', 
              padding: '20px 0',
              opacity: comment.isOptimistic ? 0.6 : 1,
              transition: 'opacity 0.3s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>
                {comment.authorName?.toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', color: '#666', fontFamily: 'var(--font-sans)' }}>
                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : 'Just now'}
              </div>
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.5', color: '#333' }}>
          {sanitizeInput(comment.content)}
            </div>
            {(userRole === 'admin' || user?.uid === comment.authorId) && (
              <button 
                onClick={() => confirmDelete(comment.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#d32f2f', 
                  padding: 0, 
                  fontSize: '11px', 
                  marginTop: '15px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px 0' }}>
            No correspondence has been recorded for this article.
          </p>
        )}
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onDismiss={() => setToast(null)} 
        />
      )}

      <Dialog 
        isOpen={deleteDialogOpen}
        title="Remove Correspondence"
        message="Are you certain you wish to remove this correspondence from the public record? This action cannot be undone."
        onConfirm={handleDeleteComment}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Remove"
      />
    </div>
  );
};

export default CommentSection;
