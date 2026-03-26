import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToImgBB, validateImage } from '../utils/imageUpload';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('News');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Check if user is author or admin
          if (data.authorId !== user?.uid && userRole !== 'admin') {
            alert('UNAUTHORIZED ACCESS.');
            navigate('/dashboard');
            return;
          }

          setTitle(data.title);
          setContent(data.content);
          setExcerpt(data.excerpt);
          setCategory(data.category);
          setCurrentImageUrl(data.imageUrl);
          setImageUrl(data.imageUrl);
          setLoading(false);
        } else {
          alert('ARTICLE NOT FOUND.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id, user, userRole, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError('');
    setUploadingImage(true);

    try {
      validateImage(file);
      const result = await uploadToImgBB(file);
      setImageUrl(result.url);
    } catch (error) {
      setImageError(error.message);
      setImageUrl(currentImageUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const postData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        category,
        imageUrl: imageUrl || currentImageUrl,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'posts', id), postData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Retrieving article records...</div>;

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="masthead" style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
          REVISE ARTICLE
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>HEADLINE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              rows="2"
            />
          </div>
          
          <div className="form-group">
            <label>ARTICLE TEXT</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
            />
          </div>

          <div className="form-group">
            <label>FEATURED IMAGE</label>
            {currentImageUrl && !imagePreview && !uploadingImage && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '10px' }}>CURRENT IMAGE:</p>
                <img 
                  src={currentImageUrl} 
                  alt="Current" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/gif,image/webp" 
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <div style={{ marginTop: '10px', color: '#666' }}>
                Uploading new image...
              </div>
            )}
            {imageError && (
              <div style={{ marginTop: '10px', color: '#d32f2f' }}>
                Error: {imageError}
              </div>
            )}
            {imagePreview && !uploadingImage && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '10px' }}>NEW IMAGE PREVIEW:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} 
                />
              </div>
            )}
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
              Or paste image URL directly:
              <input
                type="text"
                placeholder="https://i.ibb.co/xxxxx/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '5px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>
          
          <button type="submit" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'SAVING CHANGES...' : 'SAVE REVISIONS'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
