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
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Set up real-time listener for comments
  useEffect(() => {
    if (!postId) return;

    console.log('🔍 Setting up comments listener for post:', postId);
    
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const commentsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Handle createdAt properly
            createdAt: data.createdAt
          };
        });
        
        console.log('📝 Comments loaded:', commentsData.length);
        setComments(commentsData);
        setInitialLoading(false);
      },
      (error) => {
        console.error('❌ Error loading comments:', error);
        setInitialLoading(false);
        setToast({ message: 'Error loading comments', type: 'error' });
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log('🔌 Cleaning up comments listener');
      unsubscribe();
    };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setToast({ message: 'Please login to comment', type: 'error' });
      return;
    }
    
    if (!newComment.trim()) return;
    
    // Rate limiting check
    const userKey = `comment_${user.uid}`;
    if (!commentLimiter.check(userKey)) {
      setToast({ 
        message: 'Too many comments. Please wait a moment before posting again.', 
        type: 'error' 
      });
      return;
    }

    const commentContent = sanitizeInput(newComment.trim());
    setNewComment('');
    setLoading(true);

    try {
      // Add comment to Firestore
      await addDoc(collection(db, 'comments'), {
        postId,
        content: commentContent,
        authorId: user.uid,
        authorName: sanitizeInput(userProfile?.displayName || user.email.split('@')[0]),
        createdAt: serverTimestamp()
      });
      
      setToast({ message: 'Correspondence published successfully', type: 'success' });
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error adding comment:', error);
      setNewComment(commentContent);
      setToast({ message: 'Failed to publish correspondence. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
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
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error('Error deleting comment:', error);
      setToast({ message: 'Failed to remove correspondence', type: 'error' });
    } finally {
      setCommentToDelete(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="comment-section" style={{ marginTop: '30px' }}>
        <h3 className="section-header">CORRESPONDENCE</h3>
        <p>Loading comments...</p>
      </div>
    );
  }

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
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              style={{ 
                borderBottom: 'var(--hairline)', 
                padding: '20px 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>
                  {comment.authorName?.toUpperCase()}
                </div>
                <div style={{ fontSize: '11px', color: '#666', fontFamily: 'var(--font-sans)' }}>
                  {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : 
                   comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 
                   'Just now'}
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
          ))
        ) : (
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
