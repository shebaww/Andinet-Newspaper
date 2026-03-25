import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId }) => {
  const { user, userProfile, userRole } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        content: newComment,
        authorId: user.uid,
        authorName: userProfile?.displayName || user.email.split('@')[0],
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await deleteDoc(doc(db, 'comments', id));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="comment-section" style={{ marginTop: '30px' }}>
      <h3 className="section-header" style={{ fontSize: '1.2rem' }}>CORRESPONDENCE ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the conversation..."
              required
              rows="3"
              style={{ width: '100%', padding: '10px', fontFamily: 'serif' }}
            />
          </div>
          <button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? 'POSTING...' : 'SEND CORRESPONDENCE'}
          </button>
        </form>
      ) : (
        <div className="form-container" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ fontSize: '14px' }}>PLEASE <a href="/login" style={{ color: 'inherit' }}>LOGIN</a> TO JOIN THE CONVERSATION.</p>
        </div>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {comment.authorName?.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {comment.createdAt?.toDate().toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
              {comment.content}
            </div>
            {(userRole === 'admin' || user?.uid === comment.authorId) && (
              <button 
                onClick={() => handleDeleteComment(comment.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: 0, fontSize: '10px', marginTop: '10px' }}
              >
                REMOVE
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
