import React, { useState, useEffect } from 'react';

const PlayerImageGrid = ({ players, onStartAuction, currentPlayerId, teams = [], currentPlayer, currentBid, onPlaceBid, onSold, onUnsold }) => {
  const [jerseyQuery, setJerseyQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [teamImages, setTeamImages] = useState({});
  const [bidAmount, setBidAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleFindPlayer = () => {
    const jerseyProvided = jerseyQuery !== '' && jerseyQuery !== null;
    const nameProvided = nameQuery.trim() !== '';

    // Require at least one search field
    if (!jerseyProvided && !nameProvided) {
      alert('Please enter a Jersey No. or Player Name to search');
      return;
    }

    let found = null;

    if (jerseyProvided) {
      const j = Number(jerseyQuery);
      if (Number.isNaN(j) || !Number.isInteger(j) || j < 0) {
        alert('Jersey number must be a non-negative integer');
        return;
      }

      if (nameProvided) {
        const q = nameQuery.trim().toLowerCase();
        // Match both jersey number and name substring
        found = players.find(p => p.jersey_no === j && p.name.toLowerCase().includes(q));
      } else {
        // Match by jersey number only
        found = players.find(p => p.jersey_no === j);
      }
    } else if (nameProvided) {
      const q = nameQuery.trim().toLowerCase();
      found = players.find(p => p.name.toLowerCase().includes(q));
    }

    if (found) {
      // Clear inputs and start auction
      setJerseyQuery('');
      setNameQuery('');
      setBidAmount('');
      setSelectedTeam('');
      onStartAuction(found);
    } else {
      alert('Player not found');
    }
  };

  const handleRandomPlayer = () => {
    if (!players || players.length === 0) {
      alert('No available players to select');
      return;
    }

    // Filter out sold players to only select from available players
    const availablePlayers = players.filter(p => !p.sold);
    
    if (availablePlayers.length === 0) {
      alert('No available players remaining');
      return;
    }

    // Pick a random available player
    const idx = Math.floor(Math.random() * availablePlayers.length);
    const randomPlayer = availablePlayers[idx];

    // Clear inputs and start auction
    setJerseyQuery('');
    setNameQuery('');
    setBidAmount('');
    setSelectedTeam('');
    onStartAuction(randomPlayer);
  };

  const handlePlaceBid = () => {
    if (!currentPlayer || !onPlaceBid) return;
    
    if (!bidAmount) {
      alert('Please enter a bid amount');
      return;
    }
    
    const bidValue = parseInt(bidAmount);
    
    // Validate the bid amount
    if (isNaN(bidValue)) {
      alert('Please enter a valid bid amount');
      return;
    }
    
    if (bidValue <= currentBid) {
      alert('Bid must be higher than current bid!');
      return;
    }
    
    onPlaceBid(null, currentPlayer.name, bidValue);
    setBidAmount('');
  };

  const handleSold = async () => {
    if (!currentPlayer || !onSold) {
      alert('No player in auction');
      return;
    }
    if (!selectedTeam) {
      alert('Please Select a Team!');
      return;
    }
    try {
      const teamId = parseInt(selectedTeam);
      await onSold(teamId);
      setSelectedTeam('');
      setBidAmount('');
    } catch (error) {
      console.error('Error marking player as sold:', error);
    }
  };

  const handleUnsold = () => {
    if (!currentPlayer || !onUnsold) {
      alert('No player in auction');
      return;
    }
    onUnsold();
    setSelectedTeam('');
    setBidAmount('');
  }; 

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId.toString());
  };

  const getTeamInitials = (teamName) => {
    return teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} pts`;
  };

  useEffect(() => {
    const fetchTeamImages = async () => {
      const imageChecks = {};
      for (const team of teams) {
        const imageFilename = await checkTeamImage(team.name);
        if (imageFilename) {
          imageChecks[team.id] = imageFilename;
        }
      }
      setTeamImages(imageChecks);
    };

    fetchTeamImages();
  }, [teams]);

  const checkTeamImage = async (teamName) => {
    try {
      const response = await fetch(`/api/check-team-image/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      return data.exists ? data.filename : null;
    } catch (error) {
      console.error('Error checking team image:', error);
      return null;
    }
  };


  return (
    <div className="player-image-grid-section">
      <div className="player-search-form">
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="playerName"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Enter player name"
            />
          </div>
        </div>

        <div className="form-actions">
          <div className="form-group jersey-small">
            <input
              type="number"
              name="jersey"
              value={jerseyQuery}
              onChange={(e) => setJerseyQuery(e.target.value)}
              placeholder="No."
              min="0"
              step="1"
            />
          </div>
          <button type="button" className="find-btn" onClick={handleFindPlayer}>
            Find Player
          </button>
          <button
            type="button"
            className="random-btn"
            onClick={handleRandomPlayer}
            disabled={!players || players.length === 0}
          >
            New Player
          </button>



          <div className="action-buttons-small">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={handlePlaceBid} className="bid-btn-small" title="Place Bid">Bid</button>
              <input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="amount"
                style={{ width: '80px', padding: '4px 8px', fontSize: '12px' }}
              />
              <button onClick={handleSold} className="sold-btn-small" title="Mark as Sold">Sold</button>
              <button onClick={handleUnsold} className="unsold-btn-small" title="Mark as Unsold">Unsold</button>
            </div>
            
            <div className="team-buttons-grid">
              {teams.map(team => (
                <button
                  key={team.id}
                  type="button"
                  className={`team-button ${selectedTeam === team.id.toString() ? 'selected' : ''}`}
                  onClick={() => handleTeamSelect(team.id)}
                  title={`${team.name} - Budget: ${formatPrice(team.budget)}`}
                >
                  {teamImages[team.id] ? (
                    <img 
                      src={teamImages[team.id]} 
                      alt={team.name}
                      className="team-button-logo"
                    />
                  ) : (
                    <div className="team-button-logo placeholder">
                      {getTeamInitials(team.name)}
                    </div>
                  )}
                  <div className="team-button-info">
                    
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerImageGrid;
