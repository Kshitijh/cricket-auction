import React, { useState, useEffect } from 'react';
import PlayerImageGrid from './PlayerImageGrid';
import BidPanel from './BidPanel';

const API_BASE_URL = 'http://localhost:5000/api';

const CricketAuction = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch players and teams in parallel
      const [playersRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/players`),
        fetch(`${API_BASE_URL}/teams`)
      ]);

      const playersData = await playersRes.json();
      const teamsData = await teamsRes.json();

      // Map database format to frontend format
      const mappedPlayers = playersData.map(p => ({
        id: p.id,
        name: p.name,
        basePrice: p.base_price,
        role: p.role,
        sold: p.is_sold === 1,
        jersey_no: p.jersey_no
      }));

      const mappedTeams = teamsData.map(t => ({
        id: t.id,
        name: t.name,
        budget: t.current_budget,
        players: t.players.map(p => ({
          ...p,
          soldPrice: p.sold_price
        }))
      }));

      setPlayers(mappedPlayers);
      setTeams(mappedTeams);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load auction data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const startAuction = (player) => {
    if (!player.sold) {
      setCurrentPlayer(player);
      setCurrentBid(player.basePrice);
    }
  };

  const placeBid = async (teamId, playerName, bidValue) => {
    console.log('placeBid called:', { teamId, playerName, bidValue, currentBid });
    if (currentPlayer && bidValue > currentBid) {
      // Optimistically update the UI immediately so the Current Bid display reflects the user's action
      const prevBid = currentBid;
      setCurrentBid(bidValue);

      // If no team is selected, keep the update local and don't call the backend
      if (teamId === null || teamId === undefined) {
        console.log('No team selected — updated locally to', bidValue);
        return;
      }

      try {
        // Record bid in database
        const response = await fetch(`${API_BASE_URL}/auction/bid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_id: currentPlayer.id,
            team_id: teamId,
            bid_amount: bidValue
          })
        });

        if (response.ok) {
          // success - currentBid already set optimistically
          console.log('Bid recorded on server');
        } else {
          const error = await response.json();
          // revert optimistic update on failure
          setCurrentBid(prevBid);
          alert('Error placing bid: ' + error.error);
        }
      } catch (error) {
        console.error('Error placing bid:', error);
        setCurrentBid(prevBid);
        alert('Failed to place bid');
      }
    } else {
      console.log('placeBid ignored: either no active player or bid not greater than currentBid');
    }
  };

  const soldPlayer = async (teamId) => {
    if (currentPlayer && teamId) {
      const team = teams.find(t => t.id === teamId);
      if (team && team.budget >= currentBid) {
        try {
          // Mark player as sold in database
          const response = await fetch(`${API_BASE_URL}/auction/sold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              player_id: currentPlayer.id,
              team_id: teamId,
              sold_price: currentBid
            })
          });

          if (response.ok) {
            // Refresh data from backend
            await fetchData();
            setCurrentPlayer(null);
            setCurrentBid(0);
            alert(`${currentPlayer.name} sold to ${team.name} for ${currentBid} pts!`);
          } else {
            const error = await response.json();
            alert('Error: ' + error.error);
          }
        } catch (error) {
          console.error('Error selling player:', error);
          alert('Failed to sell player');
        }
      } else {
        alert('Insufficient budget!');
      }
    }
  };

  const unsoldPlayer = async () => {
    if (currentPlayer) {
      try {
        // Mark player as unsold in database
        const response = await fetch(`${API_BASE_URL}/auction/unsold`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_id: currentPlayer.id
          })
        });

        if (response.ok) {
          // Refresh data from backend
          await fetchData();
          setCurrentPlayer(null);
          setCurrentBid(0);
          alert(`${currentPlayer.name} went unsold!`);
        } else {
          const error = await response.json();
          alert('Error: ' + error.error);
        }
      } catch (error) {
        console.error('Error marking player unsold:', error);
        alert('Failed to mark player as unsold');
      }
    }
  };

  const availablePlayers = players.filter(p => !p.sold);

  if (loading) {
    return (
      <div className="cricket-auction">
        <h1 className="auction-title">🏏 Cricket Player Auction</h1>
        <div className="loading-container">
          <p>Loading auction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cricket-auction">
      <h1 className="auction-title">🏏 Cricket Player Auction</h1>
      
      <div className="auction-container-new">
        <div className="top-section">
          <PlayerImageGrid 
            players={availablePlayers}
            onStartAuction={startAuction}
            currentPlayerId={currentPlayer?.id}
            teams={teams}
          />
        </div>

        <div className="bottom-section">
          <BidPanel 
            currentPlayer={currentPlayer}
            currentBid={currentBid}
            teams={teams}
            onPlaceBid={placeBid}
            onSold={soldPlayer}
            onUnsold={unsoldPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default CricketAuction;
