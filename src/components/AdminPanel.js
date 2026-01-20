import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Shield, History, Upload, Download, RotateCcw, 
  X, Settings, Database 
} from 'lucide-react';
import { useAuction, ActionTypes } from '../context/AuctionContext';
import { parseExcelFile, exportToExcel } from '../services/excelService';
import { generateId } from '../utils/helpers';
import { dummyPlayers, dummyTeams } from '../utils/dummyData';
import TeamManagement from './TeamManagement';
import PlayerManagement from './PlayerManagement';
import AuctionHistory from './AuctionHistory';

const AdminPanel = ({ onClose }) => {
  const { state, dispatch } = useAuction();
  const [activeTab, setActiveTab] = useState('teams');
  const [isUploading, setIsUploading] = useState(false);

  const tabs = [
    { id: 'teams', label: 'Teams', icon: Shield },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Handle Excel import
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const parsedPlayers = await parseExcelFile(file);
      dispatch({ type: ActionTypes.SET_PLAYERS, payload: parsedPlayers });
      alert(`Successfully imported ${parsedPlayers.length} players!`);
    } catch (error) {
      alert('Error importing Excel file: ' + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Handle Excel export
  const handleExcelExport = () => {
    exportToExcel(state.players, state.teams);
  };

  // Handle auction reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the auction? This will unsell all players and restore team budgets.')) {
      dispatch({ type: ActionTypes.RESET_AUCTION });
      alert('Auction reset successfully!');
    }
  };

  // Load dummy data
  const handleLoadDummyData = () => {
    if (window.confirm('Load dummy data? This will replace existing players and teams.')) {
      dispatch({ type: ActionTypes.SET_PLAYERS, payload: dummyPlayers });
      dispatch({ type: ActionTypes.SET_TEAMS, payload: dummyTeams });
      alert('Dummy data loaded successfully!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-dark-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="text-white" size={32} />
            <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-dark-800 border-b border-dark-700 px-6 flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-dark-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'teams' && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TeamManagement />
              </motion.div>
            )}

            {activeTab === 'players' && (
              <motion.div
                key="players"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PlayerManagement />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AuctionHistory />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Database className="mr-2 text-primary-400" size={24} />
                    Data Management
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Import Excel */}
                    <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="text-primary-400 mb-2" size={32} />
                        <span className="text-white font-semibold mb-1">Import Players from Excel</span>
                        <span className="text-dark-400 text-sm text-center mb-3">
                          Upload Excel file with player data
                        </span>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleExcelImport}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <div className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg text-white transition-colors">
                          {isUploading ? 'Uploading...' : 'Choose File'}
                        </div>
                      </label>
                    </div>

                    {/* Export Excel */}
                    <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                      <button
                        onClick={handleExcelExport}
                        className="flex flex-col items-center w-full"
                      >
                        <Download className="text-green-400 mb-2" size={32} />
                        <span className="text-white font-semibold mb-1">Export Auction Data</span>
                        <span className="text-dark-400 text-sm text-center mb-3">
                          Download current auction data as Excel
                        </span>
                        <div className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors">
                          Export Now
                        </div>
                      </button>
                    </div>

                    {/* Load Dummy Data */}
                    <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                      <button
                        onClick={handleLoadDummyData}
                        className="flex flex-col items-center w-full"
                      >
                        <Database className="text-blue-400 mb-2" size={32} />
                        <span className="text-white font-semibold mb-1">Load Dummy Data</span>
                        <span className="text-dark-400 text-sm text-center mb-3">
                          Load sample players and teams for testing
                        </span>
                        <div className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors">
                          Load Data
                        </div>
                      </button>
                    </div>

                    {/* Reset Auction */}
                    <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                      <button
                        onClick={handleReset}
                        className="flex flex-col items-center w-full"
                      >
                        <RotateCcw className="text-red-400 mb-2" size={32} />
                        <span className="text-white font-semibold mb-1">Reset Auction</span>
                        <span className="text-dark-400 text-sm text-center mb-3">
                          Reset all players to unsold and restore team budgets
                        </span>
                        <div className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors">
                          Reset Now
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                  <h3 className="text-xl font-bold text-white mb-4">Auction Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-dark-900 rounded-lg p-4">
                      <p className="text-dark-400 text-sm mb-1">Total Players</p>
                      <p className="text-white text-2xl font-bold">{state.players.length}</p>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-4">
                      <p className="text-dark-400 text-sm mb-1">Total Teams</p>
                      <p className="text-white text-2xl font-bold">{state.teams.length}</p>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-4">
                      <p className="text-dark-400 text-sm mb-1">Players Sold</p>
                      <p className="text-white text-2xl font-bold">
                        {state.players.filter(p => p.status === 'sold').length}
                      </p>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-4">
                      <p className="text-dark-400 text-sm mb-1">Auction Items</p>
                      <p className="text-white text-2xl font-bold">{state.auctionHistory.length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
