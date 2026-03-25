import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

const DonationManager = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const donationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonations(donationsData);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <div>Accessing treasury records...</div>;

  return (
    <div className="donation-manager" style={{ marginTop: '40px' }}>
      <h2 className="section-header" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
        TREASURY RECORDS
      </h2>
      
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
              <th style={{ padding: '10px' }}>DATE</th>
              <th style={{ padding: '10px' }}>DONOR</th>
              <th style={{ padding: '10px' }}>AMOUNT</th>
              <th style={{ padding: '10px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '10px' }}>{donation.createdAt?.toDate().toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>{donation.email}</td>
                <td style={{ padding: '10px' }}>${donation.amount.toFixed(2)}</td>
                <td style={{ padding: '10px', textTransform: 'uppercase' }}>{donation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationManager;
