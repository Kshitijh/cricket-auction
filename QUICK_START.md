# 🚀 Quick Start Guide - Cricket Auction App

## Installation Steps

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```
   
   The app will automatically open at http://localhost:3000

## First Time Usage

### Step 1: Load Sample Data
1. Click **"Admin Panel"** button (top right)
2. Go to **"Settings"** tab
3. Click **"Load Dummy Data"**
4. Confirm the action

You now have:
- 10 sample players (Indian cricket stars)
- 4 teams (Mumbai Indians, Chennai Super Kings, RCB, KKR)
- Each team with 10,000 points budget

### Step 2: Start Auctioning

1. **Close the Admin Panel** (click X or outside)

2. **Select a Team** (click on any team in the right panel)

3. **Get a Player**
   - Click **"New Player"** button to get a random player
   - OR search for a specific player by name

4. **Place a Bid**
   - Enter bid amount (must be ≥ 100 points)
   - Amount will auto-fill with base points

5. **Complete the Sale**
   - Click **"Sold"** to assign player to selected team
   - Watch the confetti celebration! 🎉
   - OR click **"Unsold"** to skip

6. **Repeat** until all players are auctioned

## Key Features to Try

### 🎯 Auction Controls (Bottom Bar)
- **Search**: Find players by name
- **New Player**: Random unsold player selection
- **Bid Amount**: Enter your bid
- **Sold**: Complete the transaction
- **Unsold**: Skip to next player

### 🛠️ Admin Panel Features

#### Teams Tab
- Add new teams
- Edit team name, budget, color
- Delete teams
- View team statistics

#### Players Tab
- Add players manually
- Edit player details (name, age, phone, base points)
- Assign players to teams
- Delete players
- Change player status

#### History Tab
- View all transactions
- See sold prices
- Track auction timeline

#### Settings Tab
- **Import Excel**: Upload player data from Google Forms
- **Export Data**: Download auction results
- **Load Dummy Data**: Quick setup for testing
- **Reset Auction**: Start fresh (keeps teams/players, clears assignments)

## Common Actions

### Add Your Own Teams
1. Admin Panel → Teams
2. Click "Add Team"
3. Enter:
   - Team Name (required)
   - Budget (default: 10,000 points)
   - Team Color (for display)
4. Click "Save"

### Import Players from Excel
1. Prepare Excel file with columns:
   - Player Name
   - Profile Picture URL
   - Age
   - Phone Number

2. Admin Panel → Settings → Import Players
3. Choose your .xlsx file
4. Players auto-imported with 100 base points

### Export Auction Results
1. Admin Panel → Settings
2. Click "Export Auction Data"
3. Excel file downloads with:
   - Player details and sold prices
   - Team budgets and spending
   - Complete auction summary

## Tips & Tricks

✅ **Budget Management**
- Each team starts with 10,000 points
- Cannot spend more than available budget
- Remaining budget updates instantly

✅ **Player Status**
- **Available** (Blue): Ready to auction
- **Sold** (Green): Assigned to a team
- **Unsold** (Red): Skipped, can be auctioned again

✅ **Smart Search**
- Type player name in search box
- Click on result to select
- Search works on partial names

✅ **Quick Reset**
- Admin Panel → Settings → Reset Auction
- Keeps all teams and players
- Clears assignments and restores budgets
- Useful for running multiple auction rounds

## Troubleshooting

**Problem**: No players showing
- **Solution**: Load dummy data or import Excel file

**Problem**: Can't sell player
- **Solution**: Make sure a team is selected (right panel)

**Problem**: "Cannot afford" error
- **Solution**: Reduce bid amount or select team with more budget

**Problem**: Budget not updating
- **Solution**: Refresh the page (data is saved in browser)

**Problem**: Excel import failed
- **Solution**: Check file format (.xlsx) and column names

## Data Persistence

- All data saved automatically to browser's localStorage
- Survives page refresh
- Clearing browser data will erase auction data
- Use "Export Data" to backup before clearing

## Keyboard Shortcuts (Coming Soon)

Currently mouse/touch only, but keyboard shortcuts planned for:
- `Space` - New random player
- `Enter` - Confirm sale
- `Esc` - Cancel/Unsold
- `Ctrl+A` - Open admin panel

## Next Steps

1. ✅ Set up your teams
2. ✅ Import or add players
3. ✅ Run the auction
4. ✅ Export results
5. ✅ Share with participants!

## Support

Need help? Check the full README.md for:
- Detailed feature explanations
- Architecture documentation
- Customization guide
- Deployment instructions

---

**Enjoy your Cricket Auction! 🏏**

Happy Bidding! 🎉
