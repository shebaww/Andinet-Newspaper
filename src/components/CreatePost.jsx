import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('News');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        category,
        imageUrl,
        authorId: user.uid,
        authorName: userProfile?.displayName || user.email.split('@')[0],
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0
      };

      await addDoc(collection(db, 'posts'), postData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          DRAFT NEW ARTICLE
        </h1>
        
        <div className="byline" style={{ marginBottom: '20px' }}>
          BY {userProfile?.displayName?.toUpperCase() || user?.email?.toUpperCase()}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>HEADLINE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              required
            />
          </div>

          <div className="form-group">
            <label>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="News">News</option>
              <option value="Sports">Sports</option>
              <option value="Opinion">Opinion</option>
              <option value="Feature">Feature</option>
              <option value="Arts & Entertainment">Arts & Entertainment</option>
            </select>
          </div>

          <div className="form-group">
            <label>EXCERPT (SHORT SUMMARY)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for the homepage..."
              rows="2"
            />
          </div>
          
          <div className="form-group">
            <label>ARTICLE TEXT</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              required
              rows="10"
            />
          </div>

          <div className="form-group">
            <label>FEATURED IMAGE</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100%', marginTop: '10px', maxHeight: '200px', objectFit: 'cover' }} 
              />
            )}
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'PUBLISHING...' : 'PUBLISH TO PRESS'}
          </button>
        </form>
        
        <hr />
        
        <div className="byline" style={{ textAlign: 'center', fontSize: '10px', marginTop: '20px' }}>
          All articles are reviewed by editorial staff before publication.
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
