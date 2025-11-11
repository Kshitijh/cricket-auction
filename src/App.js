import './styles.css';
import { useState } from 'react';
import CricketAuction from './components/CricketAuction';
import AdminPanel from './components/AdminPanel';

function App() {
  const [view, setView] = useState('auction'); // 'auction' or 'admin'

  return (
    <div className="App">
      {view === 'auction' ? (
        <>
          <button 
            className="admin-toggle-btn" 
            onClick={() => setView('admin')}
          >
            🔧 Admin Panel
          </button>
          <CricketAuction />
        </>
      ) : (
        <AdminPanel onBack={() => setView('auction')} />
      )}
    </div>
  );
}

export default App;
