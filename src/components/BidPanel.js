import React, { useState } from 'react';

const BidPanel = ({ currentPlayer, currentBid, teams, onPlaceBid, onSold, onUnsold }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  const handlePlaceBid = () => {
    if (selectedTeam && bidAmount && currentPlayer) {
      const bidValue = parseInt(bidAmount);
      const teamId = parseInt(selectedTeam);
      if (bidValue > currentBid) {
        onPlaceBid(teamId, currentPlayer.name, bidValue);
        setBidAmount('');
      } else {
        alert('Bid must be higher than current bid!');
      }
    }
  };

  const handleSold = () => {
    if (selectedTeam) {
      const teamId = parseInt(selectedTeam);
      onSold(teamId);
      setSelectedTeam('');
      setBidAmount('');
    } else {
      alert('Please select a team!');
    }
  };

  const handleUnsold = () => {
    onUnsold();
    setSelectedTeam('');
    setBidAmount('');
  };

  const incrementBid = (amount) => {
    const newBid = currentBid + amount;
    setBidAmount(newBid.toString());
  };

  if (!currentPlayer) {
    return (
      <div className="bid-panel">
        <div className="no-player">
          <h2>No Player in Auction</h2>
          <p>Select a player to start bidding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bid-panel">
      <div className="current-auction">
        <h2>Current Auction</h2>
        <div className="player-details">
          <h3 className="player-name-big">{currentPlayer.name}</h3>
          <p className="player-role-big">{currentPlayer.role}</p>
          <p className="base-price">Base Price: {formatPrice(currentPlayer.basePrice)}</p>
          <div className="current-bid-display">
            <span className="label">Current Bid:</span>
            <span className="bid-value">{formatPrice(currentBid)}</span>
          </div>
        </div>

        <div className="bid-controls">
          <div className="form-group">
            <label htmlFor="team-select">Team Name:</label>
            <select 
              id="team-select"
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="team-select"
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} (Budget: {formatPrice(team.budget)})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bid-amount">Bid Value:</label>
            <input 
              id="bid-amount"
              type="number" 
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="bid-input"
            />
          </div>

          <div className="quick-bids">
            <button onClick={() => incrementBid(100000)} className="quick-bid-btn">+1L</button>
            <button onClick={() => incrementBid(500000)} className="quick-bid-btn">+5L</button>
            <button onClick={() => incrementBid(1000000)} className="quick-bid-btn">+10L</button>
          </div>

          <div className="action-buttons">
            <button onClick={handlePlaceBid} className="bid-btn">Place Bid</button>
            <button onClick={handleSold} className="sold-btn">SOLD!</button>
            <button onClick={handleUnsold} className="unsold-btn">UNSOLD</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidPanel;
