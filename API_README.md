# Cricket Auction API Documentation

## Database Setup

The application uses SQLite database (`data.db`) with the following schema:

### Tables

1. **teams**
   - `id`: Primary Key
   - `name`: Team name (unique)
   - `initial_budget`: Starting budget
   - `current_budget`: Remaining budget
   - `created_at`: Timestamp

2. **players**
   - `id`: Primary Key
   - `name`: Player name
   - `role`: Player role (Batsman, Bowler, All-Rounder, Wicket-Keeper)
   - `base_price`: Starting price
   - `sold_price`: Final sold price
   - `team_id`: Foreign key to teams
   - `is_sold`: Boolean flag
   - `created_at`: Timestamp

3. **auction_history**
   - `id`: Primary Key
   - `player_id`: Foreign key to players
   - `team_id`: Foreign key to teams
   - `bid_amount`: Bid amount
   - `bid_time`: Timestamp

## Database Connection String

```python
DATABASE = 'data.db'  # SQLite database file

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

### 1. Get All Teams
- **Endpoint**: `GET /api/teams`
- **Description**: Get all teams with their acquired players
- **Response**: Array of team objects with nested players

### 2. Get All Players
- **Endpoint**: `GET /api/players`
- **Description**: Get all players in the system
- **Response**: Array of player objects

### 3. Get Available Players
- **Endpoint**: `GET /api/players/available`
- **Description**: Get all unsold players
- **Response**: Array of unsold player objects

### 4. Place Bid
- **Endpoint**: `POST /api/auction/bid`
- **Description**: Record a bid during auction
- **Request Body**:
```json
{
  "player_id": 1,
  "team_id": 2,
  "bid_amount": 2500000
}
```

### 5. Mark Player as Sold
- **Endpoint**: `POST /api/auction/sold`
- **Description**: Finalize player sale to a team
- **Request Body**:
```json
{
  "player_id": 1,
  "team_id": 2,
  "sold_price": 3000000
}
```

### 6. Mark Player as Unsold
- **Endpoint**: `POST /api/auction/unsold`
- **Description**: Mark player as unsold
- **Request Body**:
```json
{
  "player_id": 1
}
```

### 7. Get Auction History
- **Endpoint**: `GET /api/auction/history`
- **Description**: Get complete bidding history
- **Response**: Array of bid records with player and team details

### 8. Reset Auction
- **Endpoint**: `POST /api/reset`
- **Description**: Reset entire auction (unsell all players, restore budgets)

### 9. Get Statistics
- **Endpoint**: `GET /api/stats`
- **Description**: Get auction statistics
- **Response**:
```json
{
  "total_sold": 5,
  "total_spent": 12500000,
  "most_expensive_player": {
    "name": "Virat Kohli",
    "role": "Batsman",
    "sold_price": 3500000,
    "team_name": "Royal Challengers"
  }
}
```

### 10. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Check if API is running
- **Response**: `{"status": "healthy", "database": "data.db"}`

## Running the Application

### Backend (Flask)

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000` and automatically:
- Create `data.db` if it doesn't exist
- Initialize tables
- Seed initial data (4 teams and 8 players)

### Frontend (React)

1. Install dependencies:
```bash
npm install
```

2. Start the React app:
```bash
npm start
```

The app will open on `http://localhost:3000`

## Initial Data

### Teams (Each with ₹100L budget)
1. Mumbai Indians
2. Chennai Super Kings
3. Royal Challengers
4. Kolkata Knight Riders

### Players
1. Virat Kohli - Batsman (₹20L base)
2. Rohit Sharma - Batsman (₹20L base)
3. Jasprit Bumrah - Bowler (₹20L base)
4. MS Dhoni - Wicket-Keeper (₹20L base)
5. Hardik Pandya - All-Rounder (₹15L base)
6. Ravindra Jadeja - All-Rounder (₹15L base)
7. KL Rahul - Batsman (₹15L base)
8. Mohammed Shami - Bowler (₹15L base)

## Features

- ✅ SQLite database for data persistence
- ✅ RESTful API design
- ✅ CORS enabled for React frontend
- ✅ Automatic database initialization
- ✅ Bid history tracking
- ✅ Budget management
- ✅ Statistics and analytics
- ✅ Reset functionality
