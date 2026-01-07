import React, { useState, useEffect } from 'react';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [playerImages, setPlayerImages] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    role: 'Batsman',
    base_price: 100
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
      
      // Check images for all players
      const imageChecks = {};
      for (const player of data) {
        const imageFilename = await checkPlayerImage(player.name);
        if (imageFilename) {
          imageChecks[player.id] = imageFilename;
        }
      }
      setPlayerImages(imageChecks);
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

  const uploadImage = async () => {
    if (!selectedImage || !formData.name) return null;

    const uploadFormData = new FormData();
    uploadFormData.append('image', selectedImage);
    uploadFormData.append('playerName', formData.name);

    try {
      const response = await fetch('http://localhost:5000/api/admin/upload-image', {
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

  const checkPlayerImage = async (playerName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-player-image/${encodeURIComponent(playerName)}`);
      const data = await response.json();
      return data.exists ? data.filename : null;
    } catch (error) {
      console.error('Error checking player image:', error);
      return null;
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    try {
      // Upload image first if selected
      if (selectedImage) {
        const uploaded = await uploadImage();
        if (!uploaded && selectedImage) {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch('http://localhost:5000/api/admin/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Player added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', role: 'Batsman', base_price: 100 });
        setSelectedImage(null);
        setImagePreview(null);
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
      // Upload new image if selected
      if (selectedImage) {
        const uploaded = await uploadImage();
        if (!uploaded && selectedImage) {
          return; // Stop if image upload failed
        }
      }

      const response = await fetch(`http://localhost:5000/api/admin/players/${editingPlayer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Player updated successfully!');
        setEditingPlayer(null);
        setFormData({ name: '', role: 'Batsman', base_price: 100 });
        setSelectedImage(null);
        setImagePreview(null);
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

  const startEdit = async (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      role: player.role,
      base_price: player.base_price
    });
    setSelectedImage(null);
    
    // Check if player has an image
    const imageFilename = await checkPlayerImage(player.name);
    if (imageFilename) {
      setImagePreview(`http://localhost:5000/player-images/${imageFilename}`);
    } else {
      setImagePreview(null);
    }
    
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setShowAddForm(false);
    setFormData({ name: '', role: 'Batsman', base_price: 100 });
    setSelectedImage(null);
    setImagePreview(null);
  }; 

  const formatPrice = (price) => {
    return `${price.toLocaleString()} pts`;
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
            setFormData({ name: '', role: 'Batsman', base_price: 100 });
            setSelectedImage(null);
            setImagePreview(null);
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
              <div className="form-group full-width">
                <label>Profile Picture</label>
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
                    id="image-upload"
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="file-input-label">
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                  <small>Max 5MB. PNG, JPG, JPEG, GIF, WEBP allowed</small>
                </div>
              </div>
            </div>

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
                  step="1"
                  placeholder="Enter base price (points)"
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
              <th>Sr. No.</th>
              <th>Image</th>
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
            {players.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 1}</td>
                <td>
                  {playerImages[player.id] ? (
                    <img 
                      src={`http://localhost:5000/player-images/${playerImages[player.id]}`} 
                      alt={player.name}
                      className="player-thumbnail"
                    />
                  ) : (
                    <div className="player-thumbnail-placeholder">👤</div>
                  )}
                </td>
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
