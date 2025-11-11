import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import BidPanel from './BidPanel';
import TeamList from './TeamList';

const CricketAuction = () => {
  const [players] = useState([
    { id: 1, name: 'Virat Kohli', basePrice: 2000000, role: 'Batsman', sold: false },
    { id: 2, name: 'Rohit Sharma', basePrice: 2000000, role: 'Batsman', sold: false },
    { id: 3, name: 'Jasprit Bumrah', basePrice: 2000000, role: 'Bowler', sold: false },
    { id: 4, name: 'MS Dhoni', basePrice: 2000000, role: 'Wicket-Keeper', sold: false },
    { id: 5, name: 'Hardik Pandya', basePrice: 1500000, role: 'All-Rounder', sold: false },
    { id: 6, name: 'Ravindra Jadeja', basePrice: 1500000, role: 'All-Rounder', sold: false },
    { id: 7, name: 'KL Rahul', basePrice: 1500000, role: 'Batsman', sold: false },
    { id: 8, name: 'Mohammed Shami', basePrice: 1500000, role: 'Bowler', sold: false },
  ]);

  const [teams, setTeams] = useState([
    { id: 1, name: 'Mumbai Indians', budget: 10000000, players: [] },
    { id: 2, name: 'Chennai Super Kings', budget: 10000000, players: [] },
    { id: 3, name: 'Royal Challengers', budget: 10000000, players: [] },
    { id: 4, name: 'Kolkata Knight Riders', budget: 10000000, players: [] },
  ]);

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [soldPlayers, setSoldPlayers] = useState([]);

  const startAuction = (player) => {
    if (!soldPlayers.includes(player.id)) {
      setCurrentPlayer(player);
      setCurrentBid(player.basePrice);
    }
  };

  const placeBid = (teamName, playerName, bidValue) => {
    if (currentPlayer && bidValue > currentBid) {
      setCurrentBid(bidValue);
    }
  };

  const soldPlayer = (teamId) => {
    if (currentPlayer && teamId) {
      const team = teams.find(t => t.id === teamId);
      if (team && team.budget >= currentBid) {
        const updatedTeams = teams.map(t => {
          if (t.id === teamId) {
            return {
              ...t,
              budget: t.budget - currentBid,
              players: [...t.players, { ...currentPlayer, soldPrice: currentBid }]
            };
          }
          return t;
        });

        setTeams(updatedTeams);
        setSoldPlayers([...soldPlayers, currentPlayer.id]);
        setCurrentPlayer(null);
        setCurrentBid(0);
      }
    }
  };

  const unsoldPlayer = () => {
    if (currentPlayer) {
      setSoldPlayers([...soldPlayers, currentPlayer.id]);
      setCurrentPlayer(null);
      setCurrentBid(0);
    }
  };

  const availablePlayers = players.filter(p => !soldPlayers.includes(p.id));

  return (
    <div className="cricket-auction">
      <h1 className="auction-title">🏏 Cricket Player Auction</h1>
      
      <div className="auction-container">
        <div className="left-section">
          <h2>Available Players</h2>
          <div className="player-list">
            {availablePlayers.map(player => (
              <PlayerCard 
                key={player.id}
                player={player}
                onStartAuction={startAuction}
                isCurrentPlayer={currentPlayer?.id === player.id}
              />
            ))}
          </div>
        </div>

        <div className="center-section">
          <BidPanel 
            currentPlayer={currentPlayer}
            currentBid={currentBid}
            teams={teams}
            onPlaceBid={placeBid}
            onSold={soldPlayer}
            onUnsold={unsoldPlayer}
          />
        </div>

        <div className="right-section">
          <TeamList teams={teams} />
        </div>
      </div>
    </div>
  );
};

export default CricketAuction;
