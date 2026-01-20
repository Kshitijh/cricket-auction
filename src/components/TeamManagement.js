import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuction, ActionTypes } from '../context/AuctionContext';
import { generateId, formatCurrency } from '../utils/helpers';

const TeamManagement = () => {
  const { state, dispatch } = useAuction();
  const { teams } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    budget: 10000,
    color: '#0ea5e9',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', logo: '', budget: 10000, color: '#0ea5e9' });
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setFormData(team);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter team name');
      return;
    }
    if (isAdding) {
      dispatch({ type: ActionTypes.ADD_TEAM, payload: { ...formData, id: generateId('team') } });
    } else if (editingId) {
      dispatch({ type: ActionTypes.UPDATE_TEAM, payload: { ...formData, id: editingId } });
    }
    handleCancel();
  };

  const handleDelete = (teamId) => {
    if (window.confirm('Delete this team? All players will be unassigned.')) {
      dispatch({ type: ActionTypes.DELETE_TEAM, payload: teamId });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', logo: '', budget: 10000, color: '#0ea5e9' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Team Management</h3>
        {!isAdding && !editingId && (
          <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={20} /><span>Add Team</span>
          </button>
        )}
      </div>
      {(isAdding || editingId) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h4 className="text-lg font-semibold text-white mb-4">{isAdding ? 'Add New Team' : 'Edit Team'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-dark-300 text-sm mb-2">Team Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" placeholder="Enter team name" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Logo URL</label><input type="text" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" placeholder="Enter logo URL" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Budget</label><input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })} className="w-full bg-dark-900 text-white px-4 py-2 rounded-lg border border-dark-700 focus:border-primary-500 focus:outline-none" /></div>
            <div><label className="block text-dark-300 text-sm mb-2">Color</label><input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-10 w-full rounded-lg cursor-pointer" /></div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={handleCancel} className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><X size={18} /><span>Cancel</span></button>
            <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Save size={18} /><span>Save</span></button>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <motion.div key={team.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
            <div className="flex justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: team.color }}>{team.name.charAt(0)}</div>
                <div><h4 className="text-white font-semibold">{team.name}</h4><p className="text-dark-400 text-sm">{formatCurrency(team.budget)} pts</p></div>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => handleEdit(team)} className="p-2 hover:bg-dark-700 rounded text-blue-400"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(team.id)} className="p-2 hover:bg-dark-700 rounded text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {teams.length === 0 && <div className="text-center py-12 text-dark-400"><p>No teams yet. Click "Add Team" to start.</p></div>}
    </div>
  );
};

export default TeamManagement;
