import React from 'react';

const TeamList = ({ teams }) => {
  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  return (
    <div className="team-list">
      <h2>Teams</h2>
      {teams.map(team => (
        <div key={team.id} className="team-card">
          <div className="team-header">
            <h3 className="team-name">{team.name}</h3>
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
