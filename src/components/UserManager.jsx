import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import Toast from './common/Toast';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      setToast({ message: `Role updated to ${newRole}`, type: 'success' });
    } catch (error) {
      console.error('Error updating role:', error);
      setToast({ message: 'Failed to update user role', type: 'error' });
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-header)' }}>
      ACCESSING PERSONNEL FILES...
    </div>
  );

  return (
    <div className="user-manager" style={{ marginTop: '40px' }}>
      <header style={{ marginBottom: '30px', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
        <h2 className="h-large" style={{ margin: 0 }}>PERSONNEL MANAGEMENT</h2>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Authorized access only. All changes are logged.
        </p>
      </header>

      <div className="grid-system" style={{ marginBottom: '30px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <input
            type="text"
            className="editor-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderBottom: '1px solid var(--text-ink)' }}
          />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <select 
            className="editor-input" 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ borderBottom: '1px solid var(--text-ink)' }}
          >
            <option value="all">All Roles</option>
            <option value="reader">Reader</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table className="nyt-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{user.displayName || 'Unnamed Correspondent'}</td>
                <td style={{ color: '#666' }}>{user.email}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    backgroundColor: user.role === 'admin' ? '#111' : user.role === 'editor' ? '#ABB0AC' : '#f0f0f0',
                    color: user.role === 'admin' ? 'white' : 'black',
                    borderRadius: '2px'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '12px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ 
                      padding: '5px', 
                      fontFamily: 'var(--font-sans)', 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      border: '1px solid var(--silver-accent)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="reader">Assign Reader</option>
                    <option value="editor">Assign Editor</option>
                    <option value="admin">Assign Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
            <p style={{ fontStyle: 'italic', color: '#666' }}>No personnel records match your search criteria.</p>
          </div>
        )}
      </div>

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

export default UserManager;
