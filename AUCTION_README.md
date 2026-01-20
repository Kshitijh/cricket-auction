# 🏏 Cricket Auction Manager

A professional, real-time cricket auction system built with React.js, featuring player management, team bidding, Excel integration, and stunning animations.

![Cricket Auction](https://img.shields.io/badge/React-19.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Auction System** - Live player bidding with instant updates
- **Excel Integration** - Import players from Google Forms via Excel
- **Team Management** - Create, edit, and delete teams with budget tracking
- **Player Management** - Full CRUD operations for player data
- **Smart Auction Controls** - Search, random selection, and bidding interface
- **Auction History** - Complete transaction log with timestamps

### 🎨 User Experience
- **Dark Sports Theme** - Professional, modern UI design
- **Confetti Animations** - Celebration effects when players are sold
- **Smooth Transitions** - Framer Motion animations throughout
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant UI updates using Context API
- **LocalStorage Persistence** - Data saved automatically

### 🛠️ Admin Features
- Import players from Excel files
- Export auction data to Excel
- Load dummy data for testing
- Reset entire auction
- Comprehensive statistics dashboard
- Team and player CRUD operations

## 🚀 Tech Stack

- **React.js 19.2.0** - UI library
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Context API** - State management
- **Framer Motion 11.0.3** - Animation library
- **Canvas Confetti 1.9.2** - Celebration effects
- **SheetJS (xlsx) 0.18.5** - Excel file processing
- **Lucide React 0.344.0** - Icon library

## 📁 Project Structure

```
cricket-auction/
├── src/
│   ├── components/
│   │   ├── AdminPanel.js           # Admin interface modal
│   │   ├── AuctionBoard.js         # Main auction screen
│   │   ├── AuctionControls.js      # Footer controls
│   │   ├── AuctionHistory.js       # Transaction history
│   │   ├── PlayerCard.js           # Player display card
│   │   ├── PlayerManagement.js     # Player CRUD
│   │   ├── TeamList.js             # Team sidebar
│   │   └── TeamManagement.js       # Team CRUD
│   ├── context/
│   │   └── AuctionContext.js       # Global state management
│   ├── services/
│   │   └── excelService.js         # Excel import/export
│   ├── utils/
│   │   ├── dummyData.js           # Sample data
│   │   └── helpers.js             # Utility functions
│   ├── App.js                     # Root component
│   ├── index.js                   # App entry point
│   └── index.css                  # Global styles
├── public/
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎯 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Clone or Download
```bash
cd d:\Workspace\cricket-auction
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React and React DOM
- Tailwind CSS and PostCSS
- Framer Motion
- Canvas Confetti
- XLSX (SheetJS)
- Lucide React icons

### Step 3: Start Development Server
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Step 4: Build for Production
```bash
npm run build
```

## 📊 Excel Import Format

Your Excel file should have these columns:

| Column Name | Description | Required |
|------------|-------------|----------|
| Player Name | Full name of player | Yes |
| Profile Picture URL | Google Drive public link | No |
| Age | Player's age | Yes |
| Phone Number | Contact number | Yes |

### Google Form Setup
1. Create a Google Form with the above fields
2. Link it to a Google Sheet
3. Download the sheet as Excel (.xlsx)
4. Upload via Admin Panel → Settings → Import Players

## 🎮 Usage Guide

### First Time Setup

1. **Launch Admin Panel**
   - Click "Admin Panel" button in the header

2. **Add Teams**
   - Go to Teams tab
   - Click "Add Team"
   - Enter team name, budget (default 10000), and color
   - Repeat for all teams

3. **Add Players**
   - Go to Players tab
   - Either:
     - Click "Add Player" to add manually
     - Go to Settings → Import from Excel
     - Or load dummy data for testing

### Running an Auction

1. **Select a Player**
   - Use "New Player" for random selection
   - Or search by name

2. **Choose a Team**
   - Click on a team from the right panel

3. **Set Bid Amount**
   - Enter bid points (must be ≥ base points)

4. **Complete Transaction**
   - Click "Sold" to assign player to team
   - Click "Unsold" to skip the player

5. **Watch the Magic**
   - Confetti animation on successful sale
   - Real-time budget updates
   - Player moves to team

### Admin Operations

- **Export Data**: Settings → Export Auction Data
- **Reset Auction**: Settings → Reset Auction
- **View History**: History tab shows all transactions
- **Edit Teams**: Update budget, name, or color anytime
- **Edit Players**: Change base points, status, or team assignment

## 🎨 Customization

### Change Color Scheme
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
    600: '#YOUR_COLOR',
    // ... etc
  }
}
```

### Modify Initial Budget
Change in `src/utils/dummyData.js` and team creation:
```javascript
budget: 15000  // Change from 10000
```

### Update Base Points
Default is 100. Change in:
- Excel import: `src/services/excelService.js`
- Manual add: `src/components/PlayerManagement.js`

## 🐛 Troubleshooting

### Excel Import Not Working
- Ensure file is .xlsx format
- Check column names match exactly
- Verify file isn't corrupted

### Players Not Showing
- Check if players were added (Admin → Players)
- Try loading dummy data
- Clear browser cache and localStorage

### Budget Issues
- Verify team has sufficient budget
- Check if bid amount ≥ base points
- Reset auction if needed

### UI Not Updating
- Refresh the page
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

## 📝 Key Features Explained

### Context API State Management
- Global state accessible from any component
- Automatic localStorage persistence
- Optimistic UI updates

### Confetti Animation
- Triggers on successful player sales
- Multi-color particle effects
- 3-second duration

### Random Player Selection
- Filters available and unsold players
- True random selection
- Prevents duplicates

### Budget Validation
- Real-time budget checking
- Prevents overspending
- Auto-updates after transactions

## 🔒 Data Persistence

All data is stored in browser's localStorage:
- Players
- Teams
- Current auction state
- Transaction history

**Note**: Clearing browser data will erase all information.

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'build' folder to Netlify
```

### GitHub Pages
```bash
npm install gh-pages
# Add to package.json:
# "homepage": "https://yourusername.github.io/cricket-auction"
npm run build
npm run deploy
```

## 📄 License

MIT License - feel free to use for any purpose

## 👨‍💻 Development

Built with clean code principles:
- Component-based architecture
- Reusable utility functions
- Comprehensive comments
- Type-safe patterns
- Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues or questions:
- Check existing Issues on GitHub
- Create new Issue with details
- Include error messages and screenshots

## 🎯 Roadmap

- [ ] Multi-round auction support
- [ ] Player statistics tracking
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Backend API integration
- [ ] Real-time multi-user support

---

**Made with ❤️ for Cricket Fans**

Happy Auctioning! 🏏
