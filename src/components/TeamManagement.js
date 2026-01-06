import React, { useState, useEffect } from 'react';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [teamImages, setTeamImages] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    budget: 10000000
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('https://cricket-auction-wnqj.onrender.com/api/teams');
      const data = await response.json();
      setTeams(data);
      
      // Check images for all teams
      const imageChecks = {};
      for (const team of data) {
        const imageFilename = await checkTeamImage(team.name);
        if (imageFilename) {
          imageChecks[team.id] = imageFilename;
        }
      }
      setTeamImages(imageChecks);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const checkTeamImage = async (teamName) => {
    try {
      const response = await fetch(`https://cricket-auction-wnqj.onrender.com/api/check-team-image/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      return data.exists ? `https://cricket-auction-wnqj.onrender.com/team-images/${data.filename}` : null;
    } catch (error) {
      console.error('Error checking team image:', error);
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG, JPG, JPEG, GIF, and WEBP images are allowed');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadTeamImage = async () => {
    if (!selectedImage || !formData.name) return null;

    const uploadFormData = new FormData();
    uploadFormData.append('image', selectedImage);
    uploadFormData.append('teamName', formData.name);

    try {
      const response = await fetch('https://cricket-auction-wnqj.onrender.com/api/admin/upload-team-image', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        const data = await response.json();
        return data.filename;
      } else {
        const error = await response.json();
        alert('Error uploading image: ' + error.error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
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
      // Upload image first if selected
      if (selectedImage) {
        const uploaded = await uploadTeamImage();
        if (!uploaded && selectedImage) {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch('https://cricket-auction-wnqj.onrender.com/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Team added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', budget: 10000000 });
        setSelectedImage(null);
        setImagePreview(null);
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
      // Upload new image if selected
      if (selectedImage) {
        const uploaded = await uploadTeamImage();
        if (!uploaded && selectedImage) {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch(`https://cricket-auction-wnqj.onrender.com/api/admin/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Team updated successfully!');
        setEditingTeam(null);
        setFormData({ name: '', budget: 10000000 });
        setSelectedImage(null);
        setImagePreview(null);
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
        const response = await fetch(`https://cricket-auction-wnqj.onrender.com/api/admin/teams/${teamId}`, {
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

  const startEdit = async (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      budget: team.initial_budget
    });
    setSelectedImage(null);
    
    // Check if team has an image
    const imageFilename = await checkTeamImage(team.name);
    if (imageFilename) {
      setImagePreview(imageFilename);
    } else {
      setImagePreview(null);
    }
    
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setShowAddForm(false);
    setFormData({ name: '', budget: 10000000 });
    setSelectedImage(null);
    setImagePreview(null);
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
            setSelectedImage(null);
            setImagePreview(null);
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
              <div className="form-group full-width">
                <label>Team Logo/Image</label>
                <div className="image-upload-container">
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageChange}
                    id="team-image-upload"
                    className="file-input"
                  />
                  <label htmlFor="team-image-upload" className="file-input-label">
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                  <small>Max 5MB. PNG, JPG, JPEG, GIF, WEBP allowed</small>
                </div>
              </div>
            </div>

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
              <div className="team-header-with-logo">
                {teamImages[team.id] ? (
                  <img 
                    src={teamImages[team.id]} 
                    alt={team.name}
                    className="team-logo-circle"
                  />
                ) : (
                  <div className="team-logo-circle placeholder">
                    🏆
                  </div>
                )}
                <h3>{team.name}</h3>
              </div>
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
