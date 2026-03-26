// Dashboard.jsx - Replace with this fixed version
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, limit, query, where, getDocs, deleteDoc, doc, orderBy, updateDoc, startAfter, getCountFromServer } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import UserManager from './UserManager';
import DonationManager from './DonationManager';
import Dialog from './common/Dialog';
import Toast from './common/Toast';
import Pagination from './common/Pagination';

const Dashboard = () => {
  const { user, userRole, userProfile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Build the query based on user role
        let baseQuery;
        if (userRole === 'admin') {
          baseQuery = query(
            collection(db, 'posts'), 
            orderBy('createdAt', 'desc')
          );
        } else if (userRole === 'editor') {
          baseQuery = query(
            collection(db, 'posts'), 
            where('authorId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        } else {
          setPosts([]);
          setLoading(false);
          return;
        }

        // Get total count using getCountFromServer for better performance
        const countSnapshot = await getCountFromServer(baseQuery);
        const totalCount = countSnapshot.data().count;
        setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
        
        // Calculate correct total views (need to fetch all posts for views sum, but only once)
        // This is still a limitation, but better than before
        if (totalCount > 0) {
          const allPostsSnapshot = await getDocs(baseQuery);
          const totalViews = allPostsSnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            return acc + (data.views || 0);
          }, 0);
          setStats({ totalPosts: totalCount, totalViews });
        } else {
          setStats({ totalPosts: 0, totalViews: 0 });
        }

        // Handle pagination
        let paginatedQuery;
        if (currentPage === 1) {
          paginatedQuery = query(baseQuery, limit(POSTS_PER_PAGE));
        } else {
          if (!lastDoc) {
            // Need to fetch up to the current page to get the cursor
            const allDocsUpToPage = await getDocs(query(baseQuery, limit(POSTS_PER_PAGE * (currentPage - 1))));
            const lastDocOfPrevPage = allDocsUpToPage.docs[allDocsUpToPage.docs.length - 1];
            paginatedQuery = query(baseQuery, startAfter(lastDocOfPrevPage), limit(POSTS_PER_PAGE));
          } else {
            paginatedQuery = query(baseQuery, startAfter(lastDoc), limit(POSTS_PER_PAGE));
          }
        }

        const querySnapshot = await getDocs(paginatedQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        
        // Store last document for next page
        if (querySnapshot.docs.length === POSTS_PER_PAGE) {
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          setLastDoc(null);
        }
        
        // Store first document for previous page
        if (querySnapshot.docs.length > 0) {
          setFirstDoc(querySnapshot.docs[0]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole, currentPage]);

  const confirmDelete = (id) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setDeleteDialogOpen(false);
    try {
      await deleteDoc(doc(db, 'posts', postToDelete));
      setPosts(posts.filter(post => post.id !== postToDelete));
      // Refresh stats after deletion
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      setToast({ message: 'Article removed from archives', type: 'success' });
    } catch (error) {
      console.error('Error deleting post:', error);
      setToast({ message: 'Failed to remove article', type: 'error' });
    } finally {
      setPostToDelete(null);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '150px', fontFamily: 'var(--font-header)' }}>
      ACCESSING EDITORIAL RECORDS...
    </div>
  );

  const now = new Date();
  const publishedPosts = posts.filter(p => !p.publishedAt || new Date(p.publishedAt.toDate ? p.publishedAt.toDate() : p.publishedAt) <= now);
  const scheduledPosts = posts.filter(p => p.publishedAt && new Date(p.publishedAt.toDate ? p.publishedAt.toDate() : p.publishedAt) > now);

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <header style={{ padding: '60px 0', borderBottom: 'var(--border-double)', marginBottom: '50px', textAlign: 'center' }}>
        <h1 className="h-giant" style={{ margin: 0 }}>
          {userRole === 'admin' ? 'EDITORIAL HEADQUARTERS' : 'REPORTER DASHBOARD'}
        </h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>
          {userProfile?.displayName || user?.email} • {userRole?.toUpperCase()} ACCESS
        </div>
      </header>
      
      <div className="grid-system" style={{ marginBottom: '60px' }}>
        <div style={{ gridColumn: 'span 4' }}>
          <div style={{ border: '1px solid var(--text-ink)', padding: '30px', textAlign: 'center', backgroundColor: 'white', boxShadow: '10px 10px 0px var(--silver-accent)' }}>
            <div className="editor-label">Articles Published</div>
            <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-header)' }}>{stats.totalPosts}</div>
          </div>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <div style={{ border: '1px solid var(--text-ink)', padding: '30px', textAlign: 'center', backgroundColor: 'white', boxShadow: '10px 10px 0px var(--silver-accent)' }}>
            <div className="editor-label">Total Readership</div>
            <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-header)' }}>{stats.totalViews}</div>
          </div>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <div style={{ border: '1px solid var(--text-ink)', padding: '30px', textAlign: 'center', backgroundColor: 'white', boxShadow: '10px 10px 0px var(--silver-accent)' }}>
            <div className="editor-label">Upcoming Releases</div>
            <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-header)' }}>{scheduledPosts.length}</div>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', borderBottom: '1px solid black', paddingBottom: '10px' }}>
          <h2 className="h-large" style={{ margin: 0 }}>ARCHIVE MANAGEMENT</h2>
          {(userRole === 'admin' || userRole === 'editor') && (
            <Link to="/create-post" className="btn-heritage" style={{ textDecoration: 'none' }}>+ Draft New Article</Link>
          )}
        </div>

        {scheduledPosts.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h3 className="editor-label" style={{ color: 'var(--green-accent)', marginBottom: '20px' }}>Scheduled for Release</h3>
            <table className="nyt-table">
              <tbody>
                {scheduledPosts.map(post => (
                  <tr key={post.id} style={{ backgroundColor: '#fdfdfd' }}>
                    <td style={{ color: '#666', fontSize: '11px' }}>
                      {new Date(post.publishedAt.toDate ? post.publishedAt.toDate() : post.publishedAt).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 700 }}>{post.title}</td>
                    <td style={{ fontStyle: 'italic', fontSize: '11px' }}>Scheduled</td>
                    <td>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to={`/edit-post/${post.id}`} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)' }}>EDIT</Link>
                        <button onClick={() => confirmDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '11px', fontWeight: 700 }}>REMOVE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', border: '1px solid var(--silver-accent)', backgroundColor: '#f9f9f9' }}>
            <p style={{ fontFamily: 'var(--font-main)', fontStyle: 'italic', color: '#666', marginBottom: '30px' }}>
              No articles are currently on file in the press archives.
            </p>
            {(userRole === 'admin' || userRole === 'editor') && (
              <Link to="/create-post" className="btn-heritage" style={{ textDecoration: 'none' }}>Draft Your First Story</Link>
            )}
          </div>
        ) : (
          <>
            <table className="nyt-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>HEADLINE</th>
                  {userRole === 'admin' && <th>REPORTER</th>}
                  <th>VIEWS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {publishedPosts.map(post => (
                  <tr key={post.id}>
                    <td style={{ fontSize: '12px' }}>
                      {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ fontWeight: 700, maxWidth: '400px' }}>{post.title}</td>
                    {userRole === 'admin' && <td style={{ fontSize: '12px', textTransform: 'uppercase' }}>{post.authorName}</td>}
                    <td>{post.views || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to={`/post/${post.id}`} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)' }}>VIEW</Link>
                        <Link to={`/edit-post/${post.id}`} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-ink)' }}>EDIT</Link>
                        <button 
                          onClick={() => confirmDelete(post.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '11px', fontWeight: 700 }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </section>

      {userRole === 'admin' && (
        <div style={{ marginTop: '100px' }}>
          <UserManager />
          <div style={{ marginTop: '100px' }}>
            <DonationManager />
          </div>
        </div>
      )}

      {userRole === 'reader' && (
        <div style={{ textAlign: 'center', padding: '100px', border: 'var(--border-double)', backgroundColor: 'white' }}>
          <h2 className="h-large">WELCOME, SUBSCRIBER.</h2>
          <p style={{ fontFamily: 'var(--font-main)', marginTop: '20px', color: '#333' }}>
            Thank you for supporting independent journalism at The Andinet Gazette.
          </p>
          <div style={{ marginTop: '40px' }}>
            <Link to="/profile" className="btn-heritage" style={{ textDecoration: 'none' }}>Manage Your Account</Link>
          </div>
        </div>
      )}

      <Dialog 
        isOpen={deleteDialogOpen}
        title="Strike Article from Record"
        message="Are you certain you wish to permanently remove this article from the Gazette archives? This action is final and cannot be reversed by the editorial board."
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Remove Article"
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onDismiss={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
