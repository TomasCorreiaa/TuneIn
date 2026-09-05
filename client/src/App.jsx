import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:roomId" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
