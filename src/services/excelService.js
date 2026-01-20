import * as XLSX from 'xlsx';

/**
 * Parse Excel file and convert to player objects
 * @param {File} file - The Excel file to parse
 * @returns {Promise<Array>} Array of player objects
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform to player objects
        const players = jsonData.map((row, index) => ({
          id: `player_${Date.now()}_${index}`,
          name: row['Player Name'] || row['Name'] || '',
          profilePicture: row['Profile Picture URL'] || row['Picture'] || '',
          age: parseInt(row['Age']) || 0,
          phoneNumber: row['Phone Number'] || row['Phone'] || '',
          basePoints: 100,
          status: 'available', // available, sold, unsold
          teamId: null,
          soldPrice: null,
        }));
        
        resolve(players);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Export current auction data to Excel
 * @param {Array} players - Array of player objects
 * @param {Array} teams - Array of team objects
 */
export const exportToExcel = (players, teams) => {
  // Prepare player data
  const playerData = players.map(player => {
    const team = teams.find(t => t.id === player.teamId);
    return {
      'Player Name': player.name,
      'Age': player.age,
      'Phone Number': player.phoneNumber,
      'Base Points': player.basePoints,
      'Status': player.status,
      'Team': team ? team.name : 'N/A',
      'Sold Price': player.soldPrice || 'N/A',
    };
  });

  // Prepare team data
  const teamData = teams.map(team => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    const totalSpent = teamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    return {
      'Team Name': team.name,
      'Budget': team.budget,
      'Spent': totalSpent,
      'Remaining': team.budget,
      'Players Count': teamPlayers.length,
    };
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add player sheet
  const playerSheet = XLSX.utils.json_to_sheet(playerData);
  XLSX.utils.book_append_sheet(wb, playerSheet, 'Players');
  
  // Add team sheet
  const teamSheet = XLSX.utils.json_to_sheet(teamData);
  XLSX.utils.book_append_sheet(wb, teamSheet, 'Teams');

  // Download file
  XLSX.writeFile(wb, `auction_export_${new Date().toISOString().split('T')[0]}.xlsx`);
};
