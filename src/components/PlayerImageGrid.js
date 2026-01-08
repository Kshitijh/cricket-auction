import React, { useState, useEffect } from 'react';

const PlayerImageGrid = ({ players, onStartAuction, currentPlayerId, teams = [] }) => {
  const [jerseyQuery, setJerseyQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [teamImages, setTeamImages] = useState({});

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

    // Pick a random available player
    const idx = Math.floor(Math.random() * players.length);
    const randomPlayer = players[idx];

    // Clear inputs and start auction
    setJerseyQuery('');
    setNameQuery('');
    onStartAuction(randomPlayer);
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
        <h2 className="section-title">Find Player</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Jersey No.</label>
            <input
              type="number"
              name="jersey"
              value={jerseyQuery}
              onChange={(e) => setJerseyQuery(e.target.value)}
              placeholder="Enter jersey number"
              min="0"
              step="1"
            />
            <small>Integer only</small>
          </div>

          <div className="form-group">
            <label>Player Name</label>
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

          <div className="random-team-logos" aria-hidden={!teams || teams.length === 0}>
            {teams && teams.map(team => (
              <div key={team.id} className="random-team-logo" title={team.name}>
                {teamImages[team.id] ? (
                  <img src={`http://localhost:5000/team-images/${teamImages[team.id]}`} alt={team.name} />
                ) : (
                  <div className="placeholder">🏆</div>
                )}
                <span className="team-tooltip">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerImageGrid;
