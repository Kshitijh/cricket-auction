# Cricket Auction Admin Panel

## Overview

The Admin Panel provides complete control over the cricket auction system, allowing administrators to manage players, teams, and auction data.

## Access

Click the **"🔧 Admin Panel"** button in the top-right corner of the auction page to access the admin dashboard.

## Features

### 1. **Player Management**
Manage all players in the auction system.

#### Add New Player
- Click **"+ Add New Player"** button
- Fill in the required fields:
  - **Player Name**: Full name of the player
  - **Role**: Select from Batsman, Bowler, All-Rounder, or Wicket-Keeper
  - **Base Price**: Starting price for the auction (in Rupees)
- Click **"Add Player"** to save

#### Edit Player
- Click the ✏️ (Edit) icon next to any player
- Modify the player details
- Click **"Update Player"** to save changes

#### Release Player
- Click the 🔓 (Release) icon to remove a player from their team
- The team's budget will be refunded
- Player becomes available for auction again

#### Delete Player
- Click the 🗑️ (Delete) icon
- Confirm the deletion
- Player and all related auction history will be removed

### 2. **Team Management**
Manage all teams participating in the auction.

#### Add New Team
- Click **"+ Add New Team"** button
- Fill in the required fields:
  - **Team Name**: Unique team name
  - **Budget**: Initial budget for the team (default: ₹100L)
- Click **"Add Team"** to save

#### Edit Team
- Click the ✏️ (Edit) icon on any team card
- Modify team name or budget
- Note: If budget is changed, the current budget is adjusted proportionally
- Click **"Update Team"** to save changes

#### View Team Details
Each team card displays:
- **Initial Budget**: Starting budget
- **Current Budget**: Remaining budget
- **Spent**: Total amount spent on players
- **Players List**: All acquired players with their sold prices

#### Delete Team
- Click the 🗑️ (Delete) icon
- Teams can only be deleted if they have no players
- Confirm the deletion

### 3. **Auction History**
View and manage complete bidding history.

#### Features
- View all bids placed during auctions
- See player name, role, team, bid amount, and timestamp
- Delete specific history records if needed
- History is sorted by most recent bids first

#### Delete History Record
- Click the 🗑️ (Delete) icon next to any record
- Confirm the deletion
- Note: This only removes the history record, not the player assignment

### 4. **Statistics Dashboard**
Overview of auction statistics displayed at the top:
- **Total Sold**: Number of players sold
- **Total Spent**: Total money spent across all teams
- **Most Expensive**: Highest-priced player with team name

### 5. **Reset Auction**
Complete auction reset functionality:
- Click **"Reset Auction"** button in the statistics section
- Confirms before proceeding
- Actions performed:
  - All players marked as unsold
  - Players removed from teams
  - Team budgets restored to initial amounts
  - All auction history cleared

## Admin API Endpoints

### Player Management

```http
POST /api/admin/players
Content-Type: application/json
{
  "name": "Player Name",
  "role": "Batsman",
  "base_price": 2000000
}
```

```http
PUT /api/admin/players/{player_id}
Content-Type: application/json
{
  "name": "Updated Name",
  "role": "All-Rounder",
  "base_price": 2500000
}
```

```http
DELETE /api/admin/players/{player_id}
```

```http
POST /api/admin/player/{player_id}/release
```

### Team Management

```http
POST /api/admin/teams
Content-Type: application/json
{
  "name": "Team Name",
  "budget": 10000
}
```

```http
PUT /api/admin/teams/{team_id}
Content-Type: application/json
{
  "name": "Updated Team Name",
  "budget": 12000000
}
```

```http
DELETE /api/admin/teams/{team_id}
```

### Auction History

```http
DELETE /api/admin/auction-history/{history_id}
```

## Workflow Examples

### Example 1: Adding a New Player
1. Navigate to Admin Panel → Players Management
2. Click "Add New Player"
3. Enter: Name="Sachin Tendulkar", Role="Batsman", Base Price="5000000"
4. Click "Add Player"
5. Player appears in the list and is available for auction

### Example 2: Changing Team Budget
1. Navigate to Admin Panel → Teams Management
2. Find the team card (e.g., "Mumbai Indians")
3. Click ✏️ Edit icon
4. Update budget to ₹150L (15000000)
5. Click "Update Team"
6. Current budget adjusts while maintaining spent amount

### Example 3: Releasing a Player
1. Navigate to Admin Panel → Players Management
2. Find a sold player (Status: "Sold")
3. Click 🔓 Release icon
4. Confirm the action
5. Player is released, team budget refunded
6. Player becomes available for re-auction

### Example 4: Full Auction Reset
1. Navigate to Admin Panel
2. Click "Reset Auction" in statistics section
3. Confirm the action
4. All players unsold, budgets restored, history cleared
5. Auction can start fresh

## Data Validation

### Player Validation
- Name: Required, cannot be empty
- Role: Must be one of: Batsman, Bowler, All-Rounder, Wicket-Keeper
- Base Price: Must be positive number, minimum 0

### Team Validation
- Name: Required, must be unique
- Budget: Must be positive number, minimum 0
- Cannot delete team with assigned players

## Best Practices

1. **Backup Before Reset**: Auction reset is irreversible
2. **Release Before Delete**: Release players from teams before deleting
3. **Budget Management**: Be careful when editing team budgets mid-auction
4. **History Cleanup**: Only delete history records if necessary for data integrity
5. **Player Names**: Use full, official names for consistency

## Security Notes

⚠️ **Important**: The admin panel currently has no authentication. In production:
- Implement user authentication
- Add role-based access control
- Use HTTPS for all API calls
- Add audit logging for admin actions
- Implement session management

## Troubleshooting

### Issue: Cannot Delete Team
**Solution**: Release all players from the team first, then delete

### Issue: Budget Shows Negative
**Solution**: Check if budget edit was made after players were purchased. Use release function to correct.

### Issue: Player Not Appearing
**Solution**: Refresh the page or check if player was marked as sold

### Issue: Changes Not Saving
**Solution**: 
- Ensure Flask backend is running on port 5000
- Check browser console for API errors
- Verify database connection

## Component Files

- `AdminPanel.js` - Main dashboard and navigation
- `PlayerManagement.js` - Player CRUD operations
- `TeamManagement.js` - Team CRUD operations
- `AuctionHistory.js` - History viewing and deletion
- `app.py` - Backend API endpoints (lines 270-450)

## Database Impact

Admin actions directly modify the database:
- **Players Table**: Add/Update/Delete records
- **Teams Table**: Add/Update/Delete records
- **Auction History Table**: Delete records
- **Foreign Keys**: Maintained on player-team relationships

All changes are persisted in `data.db` and survive server restarts.
