import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuction, ActionTypes } from '../context/AuctionContext';
import { generateId, formatCurrency, getStatusText } from '../utils/helpers';

const PlayerManagement = () => {
  const { state, dispatch } = useAuction();
  const { players, teams } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    age: 0,
    phoneNumber: '',
    basePoints: 100,
    status: 'available',
    teamId: null,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', profilePicture: '', age: 0, phoneNumber: '', basePoints: 100, status: 'available', teamId: null });
  };

  const handleEdit = (player) => {
    setEditingId(player.id);
    setFormData(player);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter player name');
      return;
    }
    if (isAdding) {
      dispatch({ type: ActionTypes.ADD_PLAYER, payload: { ...formData, id: generateId('player'), soldPrice: null } });
    } else if (editingId) {
      dispatch({ type: ActionTypes.UPDATE_PLAYER, payload: { ...formData, id: editingId } });
    }
    handleCancel();
  };

  const handleDelete = (playerId) => {
    if (window.confirm('Delete this player?')) {
      dispatch({ type: ActionTypes.DELETE_PLAYER, payload: playerId });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', profilePicture: '', age: 0, phoneNumber: '', basePoints: 100, status: 'available', teamId: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Player Management</h3>
        {!isAdding && !editingId && (
          <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={20} /><span>Add Player</span>
          </button>
        )}
      </div>
      {(isAdding || editingId) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h4 className="text-lg font-semibold text-white mb-4">{isAdding ? 'Add New Player' : 'Edit Player'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-dark-300 text-sm mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" placeholder="Player name" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Age</label><input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Phone</label><input type="text" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" placeholder="+91 1234567890" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Base Points</label><input type="number" value={formData.basePoints} onChange={(e) => setFormData({ ...formData, basePoints: parseInt(e.target.value) || 100 })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Profile Picture URL</label><input type="text" value={formData.profilePicture} onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" placeholder="Image URL" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none"><option value="available">Available</option><option value="sold">Sold</option><option value="unsold">Unsold</option></select></div>
            <div className="md:col-span-2"><label className="block text-dark-300 text-sm mb-2">Assign Team</label><select value={formData.teamId || ''} onChange={(e) => setFormData({ ...formData, teamId: e.target.value || null })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none"><option value="">None</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={handleCancel} className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><X size={18} /><span>Cancel</span></button>
            <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Save size={18} /><span>Save</span></button>
          </div>
        </motion.div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-800">
            <tr><th className="px-4 py-3 text-left text-dark-300 font-semibold">Name</th><th className="px-4 py-3 text-left text-dark-300 font-semibold">Age</th><th className="px-4 py-3 text-left text-dark-300 font-semibold">Base Points</th><th className="px-4 py-3 text-left text-dark-300 font-semibold">Status</th><th className="px-4 py-3 text-left text-dark-300 font-semibold">Team</th><th className="px-4 py-3 text-right text-dark-300 font-semibold">Actions</th></tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const team = teams.find(t => t.id === player.teamId);
              return (
                <motion.tr key={player.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-dark-700 hover:bg-dark-800/50">
                  <td className="px-4 py-3 text-white">{player.name}</td>
                  <td className="px-4 py-3 text-dark-300">{player.age}</td>
                  <td className="px-4 py-3 text-dark-300">{formatCurrency(player.basePoints)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${player.status === 'sold' ? 'bg-green-500/20 text-green-400' : player.status === 'unsold' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{getStatusText(player.status)}</span></td>
                  <td className="px-4 py-3 text-dark-300">{team ? team.name : '-'}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => handleEdit(player)} className="p-2 hover:bg-dark-700 rounded text-blue-400 mr-1"><Edit2 size={16} /></button><button onClick={() => handleDelete(player.id)} className="p-2 hover:bg-dark-700 rounded text-red-400"><Trash2 size={16} /></button></td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {players.length === 0 && <div className="text-center py-12 text-dark-400"><p>No players yet. Click "Add Player" or import from Excel.</p></div>}
      </div>
    </div>
  );
};

export default PlayerManagement;
