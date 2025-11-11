import React, { useState, useEffect } from 'react';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Batsman',
    base_price: 1000000
  });

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'base_price' ? parseInt(value) : value
    }));
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Player added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', role: 'Batsman', base_price: 1000000 });
        fetchPlayers();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player');
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/players/${editingPlayer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Player updated successfully!');
        setEditingPlayer(null);
        setFormData({ name: '', role: 'Batsman', base_price: 1000000 });
        fetchPlayers();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Error updating player');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/players/${playerId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Player deleted successfully!');
          fetchPlayers();
        } else {
          const error = await response.json();
          alert('Error: ' + error.error);
        }
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Error deleting player');
      }
    }
  };

  const handleReleasePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to release this player from their team?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/player/${playerId}/release`, {
          method: 'POST'
        });

        if (response.ok) {
          alert('Player released successfully!');
          fetchPlayers();
          fetchTeams();
        } else {
          const error = await response.json();
          alert('Error: ' + error.error);
        }
      } catch (error) {
        console.error('Error releasing player:', error);
        alert('Error releasing player');
      }
    }
  };

  const startEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      role: player.role,
      base_price: player.base_price
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setShowAddForm(false);
    setFormData({ name: '', role: 'Batsman', base_price: 1000000 });
  };

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'N/A';
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Player Management</h2>
        <button 
          className="add-btn" 
          onClick={() => {
            setShowAddForm(true);
            setEditingPlayer(null);
            setFormData({ name: '', role: 'Batsman', base_price: 1000000 });
          }}
        >
          + Add New Player
        </button>
      </div>

      {(showAddForm || editingPlayer) && (
        <div className="form-container">
          <h3>{editingPlayer ? 'Edit Player' : 'Add New Player'}</h3>
          <form onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}>
            <div className="form-row">
              <div className="form-group">
                <label>Player Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter player name"
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Wicket-Keeper">Wicket-Keeper</option>
                </select>
              </div>

              <div className="form-group">
                <label>Base Price *</label>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="100000"
                  placeholder="Enter base price"
                />
                <small>{formatPrice(formData.base_price)}</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingPlayer ? 'Update Player' : 'Add Player'}
              </button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Base Price</th>
              <th>Status</th>
              <th>Team</th>
              <th>Sold Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td className="player-name-col">{player.name}</td>
                <td>{player.role}</td>
                <td>{formatPrice(player.base_price)}</td>
                <td>
                  <span className={`status-badge ${player.is_sold ? 'sold' : 'available'}`}>
                    {player.is_sold ? 'Sold' : 'Available'}
                  </span>
                </td>
                <td>{player.team_id ? getTeamName(player.team_id) : '-'}</td>
                <td>{player.sold_price ? formatPrice(player.sold_price) : '-'}</td>
                <td className="actions-col">
                  <button 
                    className="edit-btn-small" 
                    onClick={() => startEdit(player)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  {player.team_id && (
                    <button 
                      className="release-btn-small" 
                      onClick={() => handleReleasePlayer(player.id)}
                      title="Release from team"
                    >
                      🔓
                    </button>
                  )}
                  <button 
                    className="delete-btn-small" 
                    onClick={() => handleDeletePlayer(player.id)}
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
    </div>
  );
};

export default PlayerManagement;
