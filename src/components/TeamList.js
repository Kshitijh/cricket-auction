import React, { useState, useEffect } from 'react';

const TeamList = ({ teams }) => {
  const [teamImages, setTeamImages] = useState({});

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
      const response = await fetch(`http://localhost:5000/api/check-team-image/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      return data.exists ? data.filename : null;
    } catch (error) {
      console.error('Error checking team image:', error);
      return null;
    }
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} pts`;
  }; 

  return (
    <div className="team-list">
      <h2>Teams</h2>
      {teams.map(team => (
        <div key={team.id} className="team-card">
          <div className="team-header">
            <div className="team-name-with-logo">
              {teamImages[team.id] ? (
                <img 
                  src={`http://localhost:5000/team-images/${teamImages[team.id]}`} 
                  alt={team.name}
                  className="team-logo-small"
                />
              ) : (
                <div className="team-logo-small placeholder">
                  🏆
                </div>
              )}
              <h3 className="team-name">{team.name}</h3>
            </div>
            <p className="team-budget">Budget: {formatPrice(team.budget)}</p>
          </div>
          <div className="team-players">
            <p className="player-count">Players: {team.players.length}</p>
            {team.players.length > 0 ? (
              <ul className="player-list-items">
                {team.players.map((player, index) => (
                  <li key={index} className="player-item">
                    <span className="player-name-small">{player.name}</span>
                    <span className="player-price">{formatPrice(player.soldPrice)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-players">No players yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
