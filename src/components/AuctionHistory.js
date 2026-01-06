import React, { useState, useEffect } from 'react';

const AuctionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cricket-auction-wnqj.onrender.com/api/auction/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching auction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (historyId) => {
    if (window.confirm('Are you sure you want to delete this history record?')) {
      try {
        const response = await fetch(`https://cricket-auction-wnqj.onrender.com/api/admin/auction-history/${historyId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('History record deleted successfully!');
          fetchHistory();
        } else {
          const error = await response.json();
          alert('Error: ' + error.error);
        }
      } catch (error) {
        console.error('Error deleting history:', error);
        alert('Error deleting history record');
      }
    }
  };

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading auction history...</div>;
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Auction History</h2>
        <p className="subtitle">Complete bidding history for all players</p>
      </div>

      {history.length === 0 ? (
        <div className="no-data">
          <p>No auction history available yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Player Name</th>
                <th>Role</th>
                <th>Team Name</th>
                <th>Bid Amount</th>
                <th>Bid Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td className="player-name-col">{record.player_name}</td>
                  <td>{record.player_role}</td>
                  <td>{record.team_name}</td>
                  <td className="price-col">{formatPrice(record.bid_amount)}</td>
                  <td className="datetime-col">{formatDateTime(record.bid_time)}</td>
                  <td className="actions-col">
                    <button 
                      className="delete-btn-small" 
                      onClick={() => handleDeleteHistory(record.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuctionHistory;
