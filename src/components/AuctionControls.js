import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Search, Shuffle, DollarSign, Check, X } from 'lucide-react';
import { useAuction, ActionTypes } from '../context/AuctionContext';
import { getRandomUnsoldPlayer, canTeamAfford, searchPlayers } from '../utils/helpers';

const AuctionControls = () => {
  const { state, dispatch } = useAuction();
  const { players, teams, currentPlayer, selectedTeam } = state;

  const [bidAmount, setBidAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Handle new random player
  const handleNewPlayer = () => {
    const randomPlayer = getRandomUnsoldPlayer(players);
    if (randomPlayer) {
      dispatch({ type: ActionTypes.SET_CURRENT_PLAYER, payload: randomPlayer });
      setBidAmount(randomPlayer.basePoints.toString());
    } else {
      alert('No more unsold players available!');
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchPlayers(players, term);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  // Select player from search
  const handleSelectPlayer = (player) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PLAYER, payload: player });
    setBidAmount(player.basePoints.toString());
    setSearchTerm('');
    setShowSearch(false);
    setSearchResults([]);
  };

  // Handle sell player
  const handleSellPlayer = () => {
    if (!currentPlayer) {
      alert('Please select a player first!');
      return;
    }

    if (!selectedTeam) {
      alert('Please select a team first!');
      return;
    }

    const bid = parseInt(bidAmount);
    if (isNaN(bid) || bid < currentPlayer.basePoints) {
      alert(`Bid must be at least ${currentPlayer.basePoints} points!`);
      return;
    }

    if (!canTeamAfford(selectedTeam, bid)) {
      alert(`${selectedTeam.name} cannot afford this bid!`);
      return;
    }

    // Sell player
    dispatch({
      type: ActionTypes.SELL_PLAYER,
      payload: {
        playerId: currentPlayer.id,
        teamId: selectedTeam.id,
        bidAmount: bid,
      },
    });

    // Add to history
    dispatch({
      type: ActionTypes.ADD_AUCTION_HISTORY,
      payload: {
        id: `history_${Date.now()}`,
        playerName: currentPlayer.name,
        teamName: selectedTeam.name,
        amount: bid,
        timestamp: new Date().toISOString(),
      },
    });

    // Trigger confetti
    triggerConfetti();

    // Reset
    setBidAmount('');
  };

  // Handle mark unsold
  const handleMarkUnsold = () => {
    if (!currentPlayer) {
      alert('Please select a player first!');
      return;
    }

    dispatch({ type: ActionTypes.MARK_UNSOLD, payload: currentPlayer.id });
    
    // Add to history
    dispatch({
      type: ActionTypes.ADD_AUCTION_HISTORY,
      payload: {
        id: `history_${Date.now()}`,
        playerName: currentPlayer.name,
        teamName: 'Unsold',
        amount: 0,
        timestamp: new Date().toISOString(),
      },
    });

    setBidAmount('');
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Player Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-dark-800 text-white pl-10 pr-4 py-3 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {searchResults.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className="w-full text-left px-4 py-2 hover:bg-dark-700 text-white transition-colors border-b border-dark-700 last:border-b-0"
                  >
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-xs text-dark-400">
                      {player.status === 'available' ? 'Available' : player.status}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Player Button */}
          <button
            onClick={handleNewPlayer}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Shuffle size={20} />
            <span>New Player</span>
          </button>

          {/* Bid Amount */}
          <div className="relative">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="number"
                placeholder="Bid amount..."
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={currentPlayer?.basePoints || 0}
                className="w-full bg-dark-800 text-white pl-10 pr-4 py-3 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
          </div>

          {/* Sold Button */}
          <button
            onClick={handleSellPlayer}
            disabled={!currentPlayer || !selectedTeam}
            className="bg-green-600 hover:bg-green-700 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Check size={20} />
            <span>Sold</span>
          </button>

          {/* Unsold Button */}
          <button
            onClick={handleMarkUnsold}
            disabled={!currentPlayer}
            className="bg-red-600 hover:bg-red-700 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <X size={20} />
            <span>Unsold</span>
          </button>
        </div>

        {/* Current Selection Info */}
        {currentPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-between text-sm"
          >
            <div className="text-dark-300">
              Current: <span className="text-white font-semibold">{currentPlayer.name}</span>
            </div>
            {selectedTeam && (
              <div className="text-dark-300">
                Team: <span className="text-white font-semibold">{selectedTeam.name}</span>
                {' '}(Budget: <span className="text-primary-400">{selectedTeam.budget}</span> pts)
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuctionControls;
