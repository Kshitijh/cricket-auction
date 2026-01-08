import React, { useState, useEffect, useRef } from 'react';

const BidPanel = ({ currentPlayer, currentBid, teams, onPlaceBid, onSold, onUnsold }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [playerImage, setPlayerImage] = useState(null);
  const [teamImages, setTeamImages] = useState({});
  const [showSoldText, setShowSoldText] = useState(false);
  const soldTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soldTimeoutRef.current) {
        clearTimeout(soldTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check team images for all teams
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

  useEffect(() => {
    // Check if player image exists whenever currentPlayer changes
    const checkImage = async () => {
      if (currentPlayer) {
        try {
          const response = await fetch(`http://localhost:5000/api/check-player-image/${encodeURIComponent(currentPlayer.name)}`);
          const data = await response.json();
          if (data.exists) {
            setPlayerImage(data.filename);
          } else {
            setPlayerImage(null);
          }
        } catch (error) {
          console.error('Error checking player image:', error);
          setPlayerImage(null);
        }
      } else {
        setPlayerImage(null);
      }
    };
    
    checkImage();
  }, [currentPlayer]);

  const checkTeamImage = async (teamName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-team-image/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      return data.exists ? `http://localhost:5000/team-images/${data.filename}` : null;
    } catch (error) {
      console.error('Error checking team image:', error);
      return null;
    }
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} pts`;
  }; 

  const handlePlaceBid = () => {
    if (!currentPlayer) return;

    // If the user didn't enter an amount, use a default increment (+100)
    const bidValue = bidAmount ? parseInt(bidAmount) : (currentBid + 100);
    const teamId = selectedTeam ? parseInt(selectedTeam) : null;

    console.log('handlePlaceBid:', { selectedTeam, bidAmount, bidValue, currentBid, teamId });

    if (isNaN(bidValue)) {
      alert('Please enter a valid bid amount');
      return;
    }

    if (bidValue > currentBid) {
      onPlaceBid(teamId, currentPlayer.name, bidValue);
      setBidAmount('');
    } else {
      alert('Bid must be higher than current bid!');
    }
  };

  const handleSold = async () => {
    if (selectedTeam) {
      const teamId = parseInt(selectedTeam);
      try {
        const success = await onSold(teamId);
        if (success) {
          // Show sold badge briefly until parent clears currentPlayer
          setShowSoldText(true);
          soldTimeoutRef.current = setTimeout(() => setShowSoldText(false), 2200);
        }
      } catch (error) {
        console.error('Error executing sold action:', error);
      }

      setSelectedTeam('');
      setBidAmount('');
    } else {
      alert('Please Select a Team!');
    }
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId.toString());
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
          <div className="player-auction-header">
            {playerImage ? (
              <img 
                src={`http://localhost:5000/player-images/${playerImage}`} 
                alt={currentPlayer.name}
                className="player-auction-image"
              />
            ) : (
              <div className="player-auction-image placeholder">
                👤
              </div>
            )}
            <div className="player-auction-info">
              <h3 className="player-name-big">{currentPlayer.name}</h3>
              <p className="player-role-big">{currentPlayer.role}</p>
            </div>
            {(showSoldText || currentPlayer.sold) && (
              <div className="sold-badge" aria-live="polite">SOLD!!</div>
            )}
          </div>
          <p className="base-price">Base Price: {formatPrice(currentPlayer.basePrice)}</p>
          <div className="current-bid-display">
            <span className="label">Current Bid:</span>
            <span className="bid-value">{formatPrice(currentBid)}</span>
          </div>
        </div>

        <div className="bid-controls">
          <div className="form-group">
            <label>Select Team:</label>
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
                      🏆
                    </div>
                  )}
                  <div className="team-button-info">
                    <span className="team-button-name">{team.name}</span>
                    <span className="team-button-budget">{formatPrice(team.budget)}</span>
                  </div>
                </button>
              ))}
            </div>
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
            <button onClick={() => incrementBid(100)} className="quick-bid-btn">+100</button>
            <button onClick={() => incrementBid(500)} className="quick-bid-btn">+500</button>
            <button onClick={() => incrementBid(1000)} className="quick-bid-btn">+1000</button>
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
