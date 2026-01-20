import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, User } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../utils/helpers';

const AuctionHistory = () => {
  const { state } = useAuction();
  const { auctionHistory } = state;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Auction History</h3>
        <span className="text-dark-400 text-sm">{auctionHistory.length} transactions</span>
      </div>

      <div className="space-y-3">
        {auctionHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-primary-600/20 p-3 rounded-full">
                  <User className="text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{item.playerName}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-sm ${item.teamName === 'Unsold' ? 'text-red-400' : 'text-primary-400'}`}>
                      {item.teamName}
                    </span>
                    <span className="text-dark-400 text-sm flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 font-bold text-xl">
                  <Award size={20} className="mr-1" />
                  {item.amount > 0 ? formatCurrency(item.amount) : 'UNSOLD'}
                </div>
                {item.amount > 0 && (
                  <span className="text-dark-400 text-sm">points</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {auctionHistory.length === 0 && (
        <div className="text-center py-12 text-dark-400">
          <p>No auction history yet. Start auctioning players to see the history here.</p>
        </div>
      )}
    </div>
  );
};

export default AuctionHistory;
