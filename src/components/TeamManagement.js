import React, { useState, useEffect } from 'react';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: 10000000
  });

  useEffect(() => {
    fetchTeams();
  }, []);

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
      [name]: name === 'budget' ? parseInt(value) : value
    }));
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Team added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', budget: 10000000 });
        fetchTeams();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error adding team');
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Team updated successfully!');
        setEditingTeam(null);
        setFormData({ name: '', budget: 10000000 });
        fetchTeams();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Error updating team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This will only work if the team has no players.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/teams/${teamId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Team deleted successfully!');
          fetchTeams();
        } else {
          const error = await response.json();
          alert('Error: ' + error.error);
        }
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Error deleting team');
      }
    }
  };

  const startEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      budget: team.initial_budget
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setShowAddForm(false);
    setFormData({ name: '', budget: 10000000 });
  };

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Team Management</h2>
        <button 
          className="add-btn" 
          onClick={() => {
            setShowAddForm(true);
            setEditingTeam(null);
            setFormData({ name: '', budget: 10000000 });
          }}
        >
          + Add New Team
        </button>
      </div>

      {(showAddForm || editingTeam) && (
        <div className="form-container">
          <h3>{editingTeam ? 'Edit Team' : 'Add New Team'}</h3>
          <form onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam}>
            <div className="form-row">
              <div className="form-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter team name"
                />
              </div>

              <div className="form-group">
                <label>Budget *</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="100000"
                  placeholder="Enter budget"
                />
                <small>{formatPrice(formData.budget)}</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingTeam ? 'Update Team' : 'Add Team'}
              </button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="teams-grid">
        {teams.map(team => (
          <div key={team.id} className="team-management-card">
            <div className="team-card-header">
              <h3>{team.name}</h3>
              <div className="team-actions">
                <button 
                  className="edit-btn-small" 
                  onClick={() => startEdit(team)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn-small" 
                  onClick={() => handleDeleteTeam(team.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="team-card-body">
              <div className="budget-info">
                <div className="budget-item">
                  <span className="label">Initial Budget:</span>
                  <span className="value">{formatPrice(team.initial_budget)}</span>
                </div>
                <div className="budget-item">
                  <span className="label">Current Budget:</span>
                  <span className="value current">{formatPrice(team.current_budget)}</span>
                </div>
                <div className="budget-item">
                  <span className="label">Spent:</span>
                  <span className="value spent">{formatPrice(team.initial_budget - team.current_budget)}</span>
                </div>
              </div>

              <div className="players-section">
                <h4>Players ({team.players?.length || 0})</h4>
                {team.players && team.players.length > 0 ? (
                  <ul className="player-list-admin">
                    {team.players.map(player => (
                      <li key={player.id}>
                        <span className="player-name">{player.name}</span>
                        <span className="player-role">{player.role}</span>
                        <span className="player-price">{formatPrice(player.sold_price)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-players-msg">No players acquired yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
