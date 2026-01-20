import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Phone } from 'lucide-react';
import { getStatusColor, getStatusText, formatCurrency } from '../utils/helpers';

const PlayerCard = ({ player, team, isSelected = false, onClick, size = 'large' }) => {
  const statusColor = getStatusColor(player.status);
  const statusText = getStatusText(player.status);

  // Size variants
  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-md',
    large: 'max-w-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`${sizeClasses[size]} w-full cursor-pointer`}
      onClick={onClick}
    >
      <div
        className={`bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl overflow-hidden shadow-2xl border-2 transition-all duration-300 ${
          isSelected ? 'border-primary-500 shadow-primary-500/50' : 'border-dark-700 hover:border-dark-600'
        }`}
      >
        {/* Player Image */}
        <div className="relative h-64 bg-dark-700 overflow-hidden">
          {player.profilePicture ? (
            <img
              src={player.profilePicture}
              alt={player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800"
            style={{ display: player.profilePicture ? 'none' : 'flex' }}
          >
            <User size={80} className="text-dark-600" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`${statusColor} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
              {statusText}
            </span>
          </div>

          {/* Team Badge (if sold) */}
          {team && player.status === 'sold' && (
            <div className="absolute top-4 left-4 bg-dark-900/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-semibold">{team.name}</span>
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="p-6">
          {/* Name */}
          <h3 className="text-2xl font-bold text-white mb-3 truncate">{player.name}</h3>

          {/* Details Grid */}
          <div className="space-y-2">
            {/* Age */}
            <div className="flex items-center text-dark-300">
              <User size={18} className="mr-2 text-primary-400" />
              <span className="text-sm">Age: <span className="text-white font-semibold">{player.age}</span></span>
            </div>

            {/* Phone */}
            <div className="flex items-center text-dark-300">
              <Phone size={18} className="mr-2 text-primary-400" />
              <span className="text-sm truncate">{player.phoneNumber}</span>
            </div>

            {/* Base Points */}
            <div className="flex items-center text-dark-300">
              <Award size={18} className="mr-2 text-primary-400" />
              <span className="text-sm">
                Base: <span className="text-white font-semibold">{formatCurrency(player.basePoints)}</span> pts
              </span>
            </div>

            {/* Sold Price (if sold) */}
            {player.status === 'sold' && player.soldPrice && (
              <div className="mt-3 pt-3 border-t border-dark-700">
                <div className="flex justify-between items-center">
                  <span className="text-dark-400 text-sm">Sold Price:</span>
                  <span className="text-primary-400 text-xl font-bold">
                    {formatCurrency(player.soldPrice)} pts
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
