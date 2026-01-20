import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAuction, ActionTypes } from '../context/AuctionContext';
import PlayerCard from './PlayerCard';
import TeamList from './TeamList';
import AuctionControls from './AuctionControls';
import AdminPanel from './AdminPanel';

const AuctionBoard = () => {
  const { state, dispatch } = useAuction();
  const { currentPlayer, teams } = state;
  const [showAdmin, setShowAdmin] = useState(false);

  const currentTeam = teams.find(t => t.id === state.selectedTeam?.id);

  const handleTeamSelect = (team) => {
    dispatch({ type: ActionTypes.SET_SELECTED_TEAM, payload: team });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 pb-32">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-2xl sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">🏏 Cricket Auction</h1>
              <p className="text-primary-100">Professional Player Auction System</p>
            </div>
            <button
              onClick={() => setShowAdmin(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 border border-white/20"
            >
              <Shield size={20} />
              <span className="font-semibold">Admin Panel</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Auction Stage (Left - 2/3) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-900/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {currentPlayer ? 'Current Player' : 'Select a Player to Start'}
              </h2>

              <div className="flex justify-center items-center min-h-[500px]">
                <AnimatePresence mode="wait">
                  {currentPlayer ? (
                    <PlayerCard
                      key={currentPlayer.id}
                      player={currentPlayer}
                      team={currentTeam}
                      isSelected={true}
                      size="large"
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-20"
                    >
                      <div className="text-8xl mb-4">🏏</div>
                      <h3 className="text-2xl text-dark-400 mb-2">No Player Selected</h3>
                      <p className="text-dark-500">Click "New Player" to start the auction</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Teams Panel (Right - 1/3) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-900/50 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 shadow-2xl sticky top-24"
            >
              <TeamList
                onTeamSelect={handleTeamSelect}
                selectedTeamId={state.selectedTeam?.id}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Auction Controls (Footer) */}
      <AuctionControls />

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AuctionBoard;
