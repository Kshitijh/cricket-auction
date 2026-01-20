/**
 * Get random unsold player
 * @param {Array} players - Array of all players
 * @returns {Object|null} Random unsold player or null
 */
export const getRandomUnsoldPlayer = (players) => {
  const unsoldPlayers = players.filter(
    player => player.status === 'available' || player.status === 'unsold'
  );
  
  if (unsoldPlayers.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
  return unsoldPlayers[randomIndex];
};

/**
 * Search players by name
 * @param {Array} players - Array of all players
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered players
 */
export const searchPlayers = (players, searchTerm) => {
  if (!searchTerm) return players;
  
  const term = searchTerm.toLowerCase();
  return players.filter(player =>
    player.name.toLowerCase().includes(term)
  );
};

/**
 * Validate if team can afford player
 * @param {Object} team - Team object
 * @param {number} bidAmount - Bid amount
 * @returns {boolean} Whether team can afford
 */
export const canTeamAfford = (team, bidAmount) => {
  return team && team.budget >= bidAmount;
};

/**
 * Get team's bought players
 * @param {Array} players - Array of all players
 * @param {string} teamId - Team ID
 * @returns {Array} Team's players
 */
export const getTeamPlayers = (players, teamId) => {
  return players.filter(player => player.teamId === teamId && player.status === 'sold');
};

/**
 * Calculate team statistics
 * @param {Object} team - Team object
 * @param {Array} players - Array of all players
 * @returns {Object} Team statistics
 */
export const getTeamStats = (team, players) => {
  const teamPlayers = getTeamPlayers(players, team.id);
  const totalSpent = teamPlayers.reduce((sum, player) => sum + (player.soldPrice || 0), 0);
  
  return {
    playersCount: teamPlayers.length,
    totalSpent,
    remainingBudget: team.budget,
    averagePrice: teamPlayers.length > 0 ? Math.round(totalSpent / teamPlayers.length) : 0,
  };
};

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'item') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get player status color
 * @param {string} status - Player status
 * @returns {string} Color class
 */
export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-500',
    sold: 'bg-blue-500',
    unsold: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

/**
 * Get player status text
 * @param {string} status - Player status
 * @returns {string} Status text
 */
export const getStatusText = (status) => {
  const texts = {
    available: 'Available',
    sold: 'Sold',
    unsold: 'Unsold',
  };
  return texts[status] || 'Unknown';
};
