from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Database connection string
DATABASE = 'data.db'

def get_db_connection():
    """Create a database connection to the SQLite database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def init_db():
    """Initialize the database with tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create Teams table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            initial_budget INTEGER NOT NULL,
            current_budget INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create Players table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            base_price INTEGER NOT NULL,
            sold_price INTEGER,
            team_id INTEGER,
            is_sold BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )
    ''')
    
    # Create Auction History table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS auction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER NOT NULL,
            team_id INTEGER NOT NULL,
            bid_amount INTEGER NOT NULL,
            bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (player_id) REFERENCES players (id),
            FOREIGN KEY (team_id) REFERENCES teams (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

def seed_initial_data():
    """Seed the database with initial teams and players"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM teams')
    if cursor.fetchone()[0] == 0:
        # Insert teams
        teams = [
            ('Mumbai Indians', 10000000, 10000000),
            ('Chennai Super Kings', 10000000, 10000000),
            ('Royal Challengers', 10000000, 10000000),
            ('Kolkata Knight Riders', 10000000, 10000000)
        ]
        cursor.executemany('INSERT INTO teams (name, initial_budget, current_budget) VALUES (?, ?, ?)', teams)
        
        # Insert players
        players = [
            ('Virat Kohli', 'Batsman', 2000000),
            ('Rohit Sharma', 'Batsman', 2000000),
            ('Jasprit Bumrah', 'Bowler', 2000000),
            ('MS Dhoni', 'Wicket-Keeper', 2000000),
            ('Hardik Pandya', 'All-Rounder', 1500000),
            ('Ravindra Jadeja', 'All-Rounder', 1500000),
            ('KL Rahul', 'Batsman', 1500000),
            ('Mohammed Shami', 'Bowler', 1500000)
        ]
        cursor.executemany('INSERT INTO players (name, role, base_price) VALUES (?, ?, ?)', players)
        
        conn.commit()
        print("Initial data seeded successfully!")
    
    conn.close()

# ==================== API ENDPOINTS ====================

@app.route('/api/teams', methods=['GET'])
def get_teams():
    """Get all teams with their players"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM teams')
    teams = [dict(row) for row in cursor.fetchall()]
    
    # Get players for each team
    for team in teams:
        cursor.execute('''
            SELECT id, name, role, base_price, sold_price 
            FROM players 
            WHERE team_id = ? AND is_sold = 1
        ''', (team['id'],))
        team['players'] = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(teams)

@app.route('/api/players', methods=['GET'])
def get_players():
    """Get all players"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM players')
    players = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(players)

@app.route('/api/players/available', methods=['GET'])
def get_available_players():
    """Get all unsold players"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM players WHERE is_sold = 0')
    players = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(players)

@app.route('/api/auction/bid', methods=['POST'])
def place_bid():
    """Record a bid in auction history"""
    data = request.json
    player_id = data.get('player_id')
    team_id = data.get('team_id')
    bid_amount = data.get('bid_amount')
    
    if not all([player_id, team_id, bid_amount]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Insert bid into auction history
    cursor.execute('''
        INSERT INTO auction_history (player_id, team_id, bid_amount)
        VALUES (?, ?, ?)
    ''', (player_id, team_id, bid_amount))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Bid placed successfully'}), 201

@app.route('/api/auction/sold', methods=['POST'])
def mark_player_sold():
    """Mark a player as sold to a team"""
    data = request.json
    player_id = data.get('player_id')
    team_id = data.get('team_id')
    sold_price = data.get('sold_price')
    
    if not all([player_id, team_id, sold_price]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if team has enough budget
    cursor.execute('SELECT current_budget FROM teams WHERE id = ?', (team_id,))
    team = cursor.fetchone()
    
    if not team:
        conn.close()
        return jsonify({'error': 'Team not found'}), 404
    
    if team['current_budget'] < sold_price:
        conn.close()
        return jsonify({'error': 'Insufficient budget'}), 400
    
    # Update player as sold
    cursor.execute('''
        UPDATE players 
        SET is_sold = 1, team_id = ?, sold_price = ?
        WHERE id = ?
    ''', (team_id, sold_price, player_id))
    
    # Update team budget
    cursor.execute('''
        UPDATE teams 
        SET current_budget = current_budget - ?
        WHERE id = ?
    ''', (sold_price, team_id))
    
    # Record final bid in history
    cursor.execute('''
        INSERT INTO auction_history (player_id, team_id, bid_amount)
        VALUES (?, ?, ?)
    ''', (player_id, team_id, sold_price))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Player sold successfully'}), 200

@app.route('/api/auction/unsold', methods=['POST'])
def mark_player_unsold():
    """Mark a player as unsold"""
    data = request.json
    player_id = data.get('player_id')
    
    if not player_id:
        return jsonify({'error': 'Missing player_id'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Just mark as sold without a team (unsold status)
    cursor.execute('''
        UPDATE players 
        SET is_sold = 1
        WHERE id = ?
    ''', (player_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Player marked as unsold'}), 200

@app.route('/api/auction/history', methods=['GET'])
def get_auction_history():
    """Get complete auction history"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            ah.id,
            ah.bid_amount,
            ah.bid_time,
            p.name as player_name,
            p.role as player_role,
            t.name as team_name
        FROM auction_history ah
        JOIN players p ON ah.player_id = p.id
        JOIN teams t ON ah.team_id = t.id
        ORDER BY ah.bid_time DESC
    ''')
    
    history = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(history)

@app.route('/api/reset', methods=['POST'])
def reset_auction():
    """Reset the entire auction"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Reset players
    cursor.execute('UPDATE players SET is_sold = 0, team_id = NULL, sold_price = NULL')
    
    # Reset team budgets
    cursor.execute('UPDATE teams SET current_budget = initial_budget')
    
    # Clear auction history
    cursor.execute('DELETE FROM auction_history')
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Auction reset successfully'}), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get auction statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total players sold
    cursor.execute('SELECT COUNT(*) as total_sold FROM players WHERE is_sold = 1 AND team_id IS NOT NULL')
    total_sold = cursor.fetchone()['total_sold']
    
    # Total money spent
    cursor.execute('SELECT SUM(sold_price) as total_spent FROM players WHERE is_sold = 1 AND team_id IS NOT NULL')
    total_spent = cursor.fetchone()['total_spent'] or 0
    
    # Most expensive player
    cursor.execute('''
        SELECT name, role, sold_price, t.name as team_name
        FROM players p
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE is_sold = 1 AND team_id IS NOT NULL
        ORDER BY sold_price DESC
        LIMIT 1
    ''')
    most_expensive = cursor.fetchone()
    
    conn.close()
    
    return jsonify({
        'total_sold': total_sold,
        'total_spent': total_spent,
        'most_expensive_player': dict(most_expensive) if most_expensive else None
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'database': DATABASE}), 200

# ==================== MAIN ====================

if __name__ == '__main__':
    # Initialize database and seed data
    if not os.path.exists(DATABASE):
        print(f"Creating database: {DATABASE}")
    
    init_db()
    seed_initial_data()
    
    print(f"\n{'='*50}")
    print(f"Cricket Auction API Server")
    print(f"Database: {DATABASE}")
    print(f"Server running on: http://localhost:5000")
    print(f"{'='*50}\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
