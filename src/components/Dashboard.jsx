// Dashboard.jsx - Mobile responsive version
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
    <div style={{ 
      textAlign: 'center', 
      padding: 'clamp(80px, 20vh, 150px) clamp(20px, 5vw, 40px)', 
      fontFamily: 'var(--font-header)',
      fontSize: 'clamp(12px, 4vw, 14px)'
    }}>
      ACCESSING EDITORIAL RECORDS...
    </div>
  );

  const now = new Date();
  const publishedPosts = posts.filter(p => !p.publishedAt || new Date(p.publishedAt.toDate ? p.publishedAt.toDate() : p.publishedAt) <= now);
  const scheduledPosts = posts.filter(p => p.publishedAt && new Date(p.publishedAt.toDate ? p.publishedAt.toDate() : p.publishedAt) > now);

  return (
    <div className="container" style={{ 
      paddingBottom: 'clamp(60px, 15vh, 100px)',
      paddingLeft: 'clamp(16px, 4vw, 20px)',
      paddingRight: 'clamp(16px, 4vw, 20px)'
    }}>
      <header style={{ 
        padding: 'clamp(40px, 10vh, 60px) 0', 
        borderBottom: 'var(--border-double)', 
        marginBottom: 'clamp(30px, 8vh, 50px)', 
        textAlign: 'center' 
      }}>
        <h1 className="h-giant" style={{ 
          margin: 0,
          fontSize: 'clamp(28px, 8vw, 48px)'
        }}>
          {userRole === 'admin' ? 'EDITORIAL HEADQUARTERS' : 'REPORTER DASHBOARD'}
        </h1>
        <div style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: 'clamp(10px, 3vw, 11px)', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          marginTop: '10px',
          wordBreak: 'break-word'
        }}>
          {userProfile?.displayName || user?.email} • {userRole?.toUpperCase()} ACCESS
        </div>
      </header>
      
      {/* Stats Grid - Responsive */}
      <div className="grid-system" style={{ 
        marginBottom: 'clamp(40px, 8vh, 60px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(16px, 4vw, 30px)'
      }}>
        <div style={{ 
          border: '1px solid var(--text-ink)', 
          padding: 'clamp(20px, 5vw, 30px)', 
          textAlign: 'center', 
          backgroundColor: 'white', 
          boxShadow: '10px 10px 0px var(--silver-accent)',
          boxSizing: 'border-box'
        }}>
          <div className="editor-label" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }}>Articles Published</div>
          <div style={{ 
            fontSize: 'clamp(2rem, 8vw, 3rem)', 
            fontWeight: 900, 
            fontFamily: 'var(--font-header)',
            wordBreak: 'break-word'
          }}>{stats.totalPosts}</div>
        </div>
        <div style={{ 
          border: '1px solid var(--text-ink)', 
          padding: 'clamp(20px, 5vw, 30px)', 
          textAlign: 'center', 
          backgroundColor: 'white', 
          boxShadow: '10px 10px 0px var(--silver-accent)',
          boxSizing: 'border-box'
        }}>
          <div className="editor-label" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }}>Total Readership</div>
          <div style={{ 
            fontSize: 'clamp(2rem, 8vw, 3rem)', 
            fontWeight: 900, 
            fontFamily: 'var(--font-header)',
            wordBreak: 'break-word'
          }}>{stats.totalViews}</div>
        </div>
        <div style={{ 
          border: '1px solid var(--text-ink)', 
          padding: 'clamp(20px, 5vw, 30px)', 
          textAlign: 'center', 
          backgroundColor: 'white', 
          boxShadow: '10px 10px 0px var(--silver-accent)',
          boxSizing: 'border-box'
        }}>
          <div className="editor-label" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }}>Upcoming Releases</div>
          <div style={{ 
            fontSize: 'clamp(2rem, 8vw, 3rem)', 
            fontWeight: 900, 
            fontFamily: 'var(--font-header)',
            wordBreak: 'break-word'
          }}>{scheduledPosts.length}</div>
        </div>
      </div>

      <section style={{ marginBottom: 'clamp(50px, 10vh, 80px)' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', // Stack on mobile
          gap: 'clamp(15px, 4vw, 20px)', // Responsive gap
          justifyContent: 'space-between', 
          alignItems: 'flex-start', // Align left on mobile
          marginBottom: '30px', 
          borderBottom: '1px solid black', 
          paddingBottom: '10px'
        }}>
          <h2 className="h-large" style={{ 
            margin: 0,
            fontSize: 'clamp(20px, 6vw, 32px)'
          }}>ARCHIVE MANAGEMENT</h2>
          {(userRole === 'admin' || userRole === 'editor') && (
            <Link to="/create-post" className="btn-heritage" style={{ 
              textDecoration: 'none',
              display: 'inline-block',
              textAlign: 'center',
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)',
              fontSize: 'clamp(11px, 3vw, 12px)'
            }}>+ Draft New Article</Link>
          )}
        </div>

        {/* Scheduled Posts - Mobile Friendly */}
        {scheduledPosts.length > 0 && (
          <div style={{ marginBottom: '50px', overflowX: 'auto' }}>
            <h3 className="editor-label" style={{ 
              color: 'var(--green-accent)', 
              marginBottom: '20px',
              fontSize: 'clamp(12px, 3.5vw, 14px)'
            }}>Scheduled for Release</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px'
            }}>
              {scheduledPosts.map(post => (
                <div key={post.id} style={{ 
                  border: '1px solid #e0e0e0',
                  padding: '16px',
                  borderRadius: '4px',
                  backgroundColor: '#fdfdfd'
                }}>
                  <div style={{ 
                    fontSize: 'clamp(11px, 3vw, 12px)', 
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    {new Date(post.publishedAt.toDate ? post.publishedAt.toDate() : post.publishedAt).toLocaleString()}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 'clamp(14px, 4vw, 16px)',
                    marginBottom: '8px',
                    wordBreak: 'break-word'
                  }}>
                    {post.title}
                  </div>
                  <div style={{ 
                    fontStyle: 'italic', 
                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                    marginBottom: '12px',
                    color: '#666'
                  }}>
                    Scheduled
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to={`/edit-post/${post.id}`} style={{ 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      fontWeight: 700, 
                      color: 'var(--text-ink)',
                      textDecoration: 'none'
                    }}>EDIT</Link>
                    <button onClick={() => confirmDelete(post.id)} style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: '#d32f2f', 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      fontWeight: 700,
                      padding: 0
                    }}>REMOVE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {posts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'clamp(60px, 15vh, 100px) clamp(20px, 5vw, 40px)', 
            border: '1px solid var(--silver-accent)', 
            backgroundColor: '#f9f9f9' 
          }}>
            <p style={{ 
              fontFamily: 'var(--font-main)', 
              fontStyle: 'italic', 
              color: '#666', 
              marginBottom: '30px',
              fontSize: 'clamp(14px, 4vw, 16px)'
            }}>
              No articles are currently on file in the press archives.
            </p>
            {(userRole === 'admin' || userRole === 'editor') && (
              <Link to="/create-post" className="btn-heritage" style={{ 
                textDecoration: 'none',
                display: 'inline-block'
              }}>Draft Your First Story</Link>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="mobile-post-cards" style={{ display: 'block' }}>
              {publishedPosts.map(post => (
                <div key={post.id} style={{ 
                  border: '1px solid #e0e0e0',
                  padding: '16px',
                  marginBottom: '16px',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ 
                    fontSize: 'clamp(10px, 2.5vw, 12px)', 
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 'clamp(14px, 4vw, 16px)',
                    marginBottom: '8px',
                    wordBreak: 'break-word'
                  }}>
                    {post.title}
                  </div>
                  {userRole === 'admin' && (
                    <div style={{ 
                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      color: '#666'
                    }}>
                      {post.authorName}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    marginBottom: '12px',
                    color: '#333'
                  }}>
                    Views: {post.views || 0}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <Link to={`/post/${post.id}`} style={{ 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      fontWeight: 700, 
                      color: 'var(--text-ink)',
                      textDecoration: 'none'
                    }}>VIEW</Link>
                    <Link to={`/edit-post/${post.id}`} style={{ 
                      fontSize: 'clamp(11px, 3vw, 12px)', 
                      fontWeight: 700, 
                      color: 'var(--text-ink)',
                      textDecoration: 'none'
                    }}>EDIT</Link>
                    <button 
                      onClick={() => confirmDelete(post.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#d32f2f', 
                        fontSize: 'clamp(11px, 3vw, 12px)', 
                        fontWeight: 700,
                        padding: 0
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table View - Hidden on mobile */}
            <div className="desktop-table-view" style={{ 
              display: 'none',
              overflowX: 'auto'
            }}>
              <table className="nyt-table" style={{ minWidth: '600px', width: '100%' }}>
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
                      <td style={{ fontWeight: 700 }}>{post.title}</td>
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
            </div>
            
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
        <div style={{ marginTop: 'clamp(60px, 10vh, 100px)' }}>
          <UserManager />
          <div style={{ marginTop: 'clamp(60px, 10vh, 100px)' }}>
            <DonationManager />
          </div>
        </div>
      )}

      {userRole === 'reader' && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'clamp(60px, 15vh, 100px) clamp(20px, 5vw, 40px)', 
          border: 'var(--border-double)', 
          backgroundColor: 'white' 
        }}>
          <h2 className="h-large" style={{ fontSize: 'clamp(24px, 6vw, 36px)' }}>WELCOME, SUBSCRIBER.</h2>
          <p style={{ 
            fontFamily: 'var(--font-main)', 
            marginTop: '20px', 
            color: '#333',
            fontSize: 'clamp(14px, 4vw, 16px)'
          }}>
            Thank you for supporting independent journalism at The Andinet Gazette.
          </p>
          <div style={{ marginTop: '40px' }}>
            <Link to="/profile" className="btn-heritage" style={{ 
              textDecoration: 'none',
              display: 'inline-block'
            }}>Manage Your Account</Link>
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

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 769px) {
          .mobile-post-cards {
            display: none !important;
          }
          .desktop-table-view {
            display: block !important;
          }
        }
        
        @media (max-width: 768px) {
          .mobile-post-cards {
            display: block !important;
          }
          .desktop-table-view {
            display: none !important;
          }
        }
        
        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          .btn-heritage,
          button,
          a {
            min-height: 44px;
            min-width: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
