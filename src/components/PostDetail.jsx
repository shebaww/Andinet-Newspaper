import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import CommentSection from './CommentSection';

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

  if (loading) return <div className="container" style={{textAlign: 'center', padding: '150px', fontFamily: 'Playfair Display'}}>RETRIEVING ARTICLE...</div>;
  if (!post) return <div className="container" style={{textAlign: 'center', padding: '150px'}}>404: ARCHIVE NOT FOUND</div>;

  return (
    <div className="container">
      <div style={{textAlign: 'center', padding: '20px 0', borderBottom: 'var(--hairline)', marginBottom: '40px'}}>
        <Link to="/" className="nav-link" style={{fontSize: '14px', fontFamily: 'UnifrakturCook'}}>The Gazette</Link>
      </div>
      
      <article style={{maxWidth: '800px', margin: '0 auto'}}>
        <header style={{textAlign: 'center', marginBottom: '50px'}}>
          <span className="kicker" style={{color: '#d32f2f'}}>{post.category}</span>
          <h1 className="headline h-giant" style={{fontSize: '5rem', cursor: 'default'}}>{post.title}</h1>
          <div className="byline" style={{borderTop: '1px solid black', borderBottom: '4px double black', padding: '15px 0', marginTop: '30px'}}>
            By {post.authorName} • Published {post.createdAt?.toDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </div>
        </header>

        {post.imageUrl && (
          <div className="media-frame" style={{marginBottom: '50px', padding: '0', border: 'none'}}>
            <img src={post.imageUrl} alt="Article" />
            <div className="caption-nyt" style={{marginTop: '10px', fontSize: '11px'}}>Staff Photo / Gazette Agency</div>
          </div>
        )}

        <div className="body-text drop-cap" style={{fontSize: '1.3rem', color: '#111', lineHeight: '1.9', whiteSpace: 'pre-wrap'}}>
          {post.content}
        </div>

        <section style={{marginTop: '100px', borderTop: '1px solid black', paddingTop: '60px'}}>
          <div className="zinc-box" style={{backgroundColor: '#ABB0AC', color: 'white'}}>
            <h4 style={{fontFamily: 'Inter', textTransform: 'uppercase', fontSize: '12px'}}>Editorial Note</h4>
            <p style={{fontSize: '13px', fontStyle: 'italic', marginTop: '10px'}}>
              The Andinet Gazette is committed to journalistic integrity. Correspondence regarding this article should be addressed to the editorial board.
            </p>
          </div>
          <CommentSection postId={post.id} />
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
