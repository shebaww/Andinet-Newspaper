// DonationManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const DonationManager = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountFilter, setAmountFilter] = useState('all');
  const [error, setError] = useState('');
  const { userRole } = useAuth();

  useEffect(() => {
    // Only fetch if user is admin
    if (userRole !== 'admin') {
      setLoading(false);
      return;
    }
    
    const fetchDonations = async () => {
      try {
        const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const donationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonations(donationsData);
        setFilteredDonations(donationsData);
      } catch (error) {
        console.error('Error fetching donations:', error);
        if (error.code === 'permission-denied') {
          setError('You don\'t have permission to view donations. Admin access required.');
        } else {
          setError('Failed to load donations. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userRole]);

  // Filter donations
  useEffect(() => {
    const filtered = donations.filter(donation => {
      const matchesSearch = donation.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAmount = amountFilter === 'all' || 
        (amountFilter === 'small' && donation.amount < 20) ||
        (amountFilter === 'medium' && donation.amount >= 20 && donation.amount < 50) ||
        (amountFilter === 'large' && donation.amount >= 50);
      return matchesSearch && matchesAmount;
    });
    setFilteredDonations(filtered);
  }, [searchTerm, amountFilter, donations]);

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Show access denied if not admin
  if (userRole !== 'admin') {
    return (
      <div className="user-manager" style={{ marginTop: '40px' }}>
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', border: '1px solid #f0f0f0' }}>
          <p style={{ fontFamily: 'var(--font-sans)', color: '#666' }}>
            ⚠️ Treasury access requires administrator privileges.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-header)' }}>
      ACCESSING TREASURY RECORDS...
    </div>
  );

  if (error) return (
    <div className="user-manager" style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2' }}>
        <p style={{ fontFamily: 'var(--font-sans)', color: '#d32f2f' }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="user-manager" style={{ marginTop: '40px' }}>
      <header style={{ marginBottom: '30px', borderBottom: 'var(--border-double)', paddingBottom: '20px' }}>
        <h2 className="h-large" style={{ margin: 0 }}>TREASURY RECORDS</h2>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#666', marginTop: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Total Contributions: ${totalAmount.toFixed(2)} • Confidential Ledger
        </p>
      </header>

      <div className="grid-system" style={{ marginBottom: '30px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <input
            type="text"
            className="editor-input"
            placeholder="Search by donor email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderBottom: '1px solid var(--text-ink)' }}
          />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <select 
            className="editor-input" 
            value={amountFilter} 
            onChange={(e) => setAmountFilter(e.target.value)}
            style={{ borderBottom: '1px solid var(--text-ink)' }}
          >
            <option value="all">All Amounts</option>
            <option value="small">Small ($0-19)</option>
            <option value="medium">Medium ($20-49)</option>
            <option value="large">Large ($50+)</option>
          </select>
        </div>
      </div>
      
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table className="nyt-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>DONOR</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation.id}>
                <td style={{ fontSize: '12px' }}>
                  {donation.createdAt?.toDate ? donation.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ fontFamily: 'var(--font-sans)', color: '#666' }}>{donation.email || 'Anonymous'}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                  ${donation.amount?.toFixed(2) || '0.00'}
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    backgroundColor: donation.status === 'completed' ? '#e0e8e0' : '#f0f0f0',
                    color: donation.status === 'completed' ? '#2c5e2c' : '#666',
                    borderRadius: '2px'
                  }}>
                    {donation.status || 'completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDonations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
            <p style={{ fontStyle: 'italic', color: '#666' }}>No donation records match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationManager;
