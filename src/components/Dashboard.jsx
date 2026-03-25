import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import UserManager from './UserManager';
import DonationManager from './DonationManager';

const Dashboard = () => {
  const { user, userRole, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        let q;
        if (userRole === 'admin') {
          // Admin sees everything
          q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        } else if (userRole === 'editor') {
          // Editor sees their own posts
          q = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
        } else {
          // Readers don't have posts to manage
          setPosts([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);

        // Calculate stats
        const totalViews = postsData.reduce((acc, curr) => acc + (curr.views || 0), 0);
        setStats({ totalPosts: postsData.length, totalViews });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole]);

  const makeMeAdmin = async () => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        role: 'admin'
      });
      alert('You are now an admin! Please refresh the page.');
      window.location.reload(); // Auto refresh
    } catch (error) {
      console.error('Error making admin:', error);
      alert('Failed to make admin. Check console for error.');
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO REMOVE THIS ARTICLE FROM THE PRESS?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) return <div className="container">Accessing records...</div>;

  return (
    <div className="container">
      {/* TEMPORARY ADMIN BUTTON - Remove this after you're admin */}
      {userRole === 'reader' && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          padding: '15px', 
          marginBottom: '20px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '10px' }}>⚠️ TEMPORARY: You are currently a READER</p>
          <button 
            onClick={makeMeAdmin}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            MAKE ME ADMIN (Temporary - Remove Later)
          </button>
        </div>
      )}
      
      <div className="masthead" style={{ fontSize: '2rem', marginBottom: '30px' }}>
        {userRole === 'admin' ? 'EDITORIAL HEADQUARTERS' : userRole === 'editor' ? 'REPORTER DASHBOARD' : 'READER DASHBOARD'}
      </div>
      
      <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div className="section-header">ARTICLES PUBLISHED</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalPosts}</div>
        </div>
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div className="section-header">TOTAL READERSHIP</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalViews}</div>
        </div>
      </div>

      {(userRole === 'admin' || userRole === 'editor') && (
        <div className="articles-management">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-header" style={{ fontSize: '1.5rem', margin: 0 }}>
              {userRole === 'admin' ? 'ALL PRESS RELEASES' : 'MY ARTICLES'}
            </h2>
            <Link to="/create-post" className="nav-link" style={{ fontWeight: 'bold' }}>+ NEW ARTICLE</Link>
          </div>
          
          {posts.length === 0 ? (
            <div className="form-container" style={{ textAlign: 'center' }}>
              <p>NO ARTICLES ON FILE. CLICK "+ NEW ARTICLE" TO CREATE YOUR FIRST POST.</p>
            </div>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
                    <th style={{ padding: '10px' }}>DATE</th>
                    <th style={{ padding: '10px' }}>TITLE</th>
                    {userRole === 'admin' && <th style={{ padding: '10px' }}>REPORTER</th>}
                    <th style={{ padding: '10px' }}>VIEWS</th>
                    <th style={{ padding: '10px' }}>ACTIONS</th>
                   </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '10px' }}>{post.createdAt?.toDate().toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>{post.title}</td>
                      {userRole === 'admin' && <td style={{ padding: '10px' }}>{post.authorName}</td>}
                      <td style={{ padding: '10px' }}>{post.views || 0}</td>
                      <td style={{ padding: '10px' }}>
                        <Link to={`/post/${post.id}`} style={{ marginRight: '10px', textDecoration: 'none', color: '#1a1a1a' }}>VIEW</Link>
                        <Link to={`/edit-post/${post.id}`} style={{ marginRight: '10px', textDecoration: 'none', color: '#1a1a1a' }}>EDIT</Link>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: 0, font: 'inherit' }}
                        >
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {userRole === 'admin' && (
        <>
          <UserManager />
          <DonationManager />
        </>
      )}

      {userRole === 'reader' && (
        <div className="form-container" style={{ textAlign: 'center' }}>
          <p>WELCOME, CITIZEN. THANK YOU FOR SUPPORTING THE ANDINET GAZETTE.</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Your membership allows you to comment on articles and receive our weekly newsletter.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
