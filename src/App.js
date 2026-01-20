import React from 'react';
import { AuctionProvider } from './context/AuctionContext';
import AuctionBoard from './components/AuctionBoard';

function App() {
  return (
    <AuctionProvider>
      <AuctionBoard />
    </AuctionProvider>
  );
}

export default App;
