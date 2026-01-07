import React, { useState, useEffect } from 'react';
import PlayerManagement from './PlayerManagement';
import TeamManagement from './TeamManagement';
import AuctionHistory from './AuctionHistory';

const AdminPanel = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('players');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the entire auction? This will unsell all players and restore team budgets.')) {
      try {
        const response = await fetch('http://localhost:5000/api/reset', {
          method: 'POST'
        });
        
        if (response.ok) {
          alert('Auction reset successfully!');
          fetchStats();
          window.location.reload();
        } else {
          alert('Failed to reset auction');
        }
      } catch (error) {
        console.error('Error resetting auction:', error);
        alert('Error resetting auction');
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔧 Admin Panel</h1>
        <button className="back-btn" onClick={onBack}>
          ← Back to Auction
        </button>
      </div>

      {stats && (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Sold</h3>
            <p className="stat-value">{stats.total_sold}</p>
          </div>
          <div className="stat-card">
            <h3>Total Spent</h3>
            <p className="stat-value">{stats.total_spent} pts</p>
          </div>
          {stats.most_expensive_player && (
            <div className="stat-card">
              <h3>Most Expensive</h3>
              <p className="stat-value">{stats.most_expensive_player.name}</p>
              <p className="stat-detail">{stats.most_expensive_player.sold_price} pts</p>
            </div>
          )}
          <div className="stat-card reset-card">
            <button className="reset-btn" onClick={handleReset}>
              Reset Auction
            </button>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Auction History
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'players' && <PlayerManagement />}
        {activeTab === 'teams' && <TeamManagement />}
        {activeTab === 'history' && <AuctionHistory />}
      </div>
    </div>
  );
};

export default AdminPanel;
