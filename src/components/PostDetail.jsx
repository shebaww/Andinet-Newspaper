import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import CommentSection from './CommentSection';
import Skeleton from './common/Skeleton';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
          await updateDoc(docRef, { views: increment(1) });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <Skeleton width="20%" height="20px" margin="0 auto" />
        <Skeleton width="80%" height="100px" margin="20px auto" />
        <Skeleton width="40%" height="40px" margin="30px auto" />
      </div>
      <Skeleton height="500px" />
      <div className="readable-container" style={{ marginTop: '50px' }}>
        <Skeleton count={10} />
      </div>
    </div>
  );
  if (!post) return <div className="container" style={{textAlign: 'center', padding: '150px'}}>404: ARCHIVE NOT FOUND</div>;

  return (
    <div className="container">
      <div style={{textAlign: 'center', padding: '20px 0', borderBottom: 'var(--hairline)', marginBottom: '40px'}}>
        <Link to="/" className="nav-link" style={{fontSize: '14px', fontFamily: 'var(--font-logo)'}}>The Andinet Gazette</Link>
      </div>
      
      <article className="grid-system" style={{ marginBottom: '100px' }}>
        <header style={{ gridColumn: 'span 12', textAlign: 'center', marginBottom: '50px' }}>
          <span className="kicker" style={{ color: '#d32f2f' }}>{post.category}</span>
          <h1 className="h-giant" style={{ cursor: 'default' }}>{post.title}</h1>
          <div className="byline" style={{ borderTop: '1px solid black', borderBottom: '4px double black', padding: '15px 0', marginTop: '30px', maxWidth: '800px', margin: '30px auto 0 auto' }}>
            By {post.authorName} • Published {post.createdAt?.toDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </div>
        </header>

        <div style={{ gridColumn: 'span 12' }}>
          {post.imageUrl && (
            <div className="media-frame" style={{ marginBottom: '50px', padding: '0', border: 'none' }}>
              <img src={post.imageUrl} alt="Article" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
              <div className="caption-nyt" style={{ marginTop: '10px', fontSize: '11px' }}>Staff Photo / Gazette Agency</div>
            </div>
          )}
        </div>

        <div className="readable-container" style={{ gridColumn: 'span 12' }}>
          <div className="body-text" style={{ fontSize: '1.25rem', color: '#111', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>

          <section style={{ marginTop: '100px', borderTop: '1px solid black', paddingTop: '60px' }}>
            <div className="zinc-box" style={{ backgroundColor: 'var(--green-accent)', color: 'white', border: 'none' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 700 }}>Editorial Note</h4>
              <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '10px' }}>
                The Andinet Gazette is committed to journalistic integrity. Correspondence regarding this article should be addressed to the editorial board.
              </p>
            </div>
            <CommentSection postId={post.id} />
          </section>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
