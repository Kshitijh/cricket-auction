import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { getTeamStats, formatCurrency } from '../utils/helpers';

const TeamList = ({ onTeamSelect, selectedTeamId }) => {
  const { state } = useAuction();
  const { teams, players } = state;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Award className="mr-2 text-primary-400" size={28} />
          Teams
        </h2>
        <span className="text-dark-400 text-sm">{teams.length} teams</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {teams.map((team) => {
            const stats = getTeamStats(team, players);
            const isSelected = team.id === selectedTeamId;
            const teamPlayers = players.filter(p => p.teamId === team.id && p.status === 'sold');

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => onTeamSelect && onTeamSelect(team)}
              >
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-lg p-4 border border-dark-700 hover:border-dark-600 shadow-lg">
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center"
                        style={{ display: team.logo ? 'none' : 'flex' }}
                      >
                        <span className="text-white font-bold text-lg">
                          {team.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{team.name}</h3>
                        <p className="text-dark-400 text-xs">{stats.playersCount} players</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dark-700">
                    {/* Budget */}
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} className="text-green-400" />
                      <div>
                        <p className="text-dark-400 text-xs">Budget</p>
                        <p className="text-white font-semibold text-sm">
                          {formatCurrency(stats.remainingBudget)}
                        </p>
                      </div>
                    </div>

                    {/* Spent */}
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-red-400" />
                      <div>
                        <p className="text-dark-400 text-xs">Spent</p>
                        <p className="text-white font-semibold text-sm">
                          {formatCurrency(stats.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Players Preview */}
                  {teamPlayers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dark-700">
                      <div className="flex items-center text-dark-400 text-xs mb-2">
                        <Users size={14} className="mr-1" />
                        <span>Squad ({teamPlayers.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teamPlayers.slice(0, 3).map((player) => (
                          <span
                            key={player.id}
                            className="bg-dark-700 text-dark-300 text-xs px-2 py-1 rounded"
                          >
                            {player.name.split(' ')[0]}
                          </span>
                        ))}
                        {teamPlayers.length > 3 && (
                          <span className="bg-dark-700 text-dark-300 text-xs px-2 py-1 rounded">
                            +{teamPlayers.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamList;
