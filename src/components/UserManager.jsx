import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role.');
    }
  };

  if (loading) return <div>Accessing personnel files...</div>;

  return (
    <div className="user-manager" style={{ marginTop: '40px' }}>
      <h2 className="section-header" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
        PERSONNEL MANAGEMENT
      </h2>
      
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
              <th style={{ padding: '10px' }}>NAME</th>
              <th style={{ padding: '10px' }}>EMAIL</th>
              <th style={{ padding: '10px' }}>ROLE</th>
              <th style={{ padding: '10px' }}>JOINED</th>
              <th style={{ padding: '10px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '10px' }}>{user.displayName}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px', textTransform: 'uppercase' }}>{user.role}</td>
                <td style={{ padding: '10px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: '5px', fontFamily: 'serif' }}
                  >
                    <option value="reader">Reader</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
