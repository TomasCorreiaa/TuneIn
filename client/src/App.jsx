import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home';
import Room from './pages/Room';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import SeasonalDecorations from './components/SeasonalDecorations';
import DevThemeTester from './components/DevThemeTester';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <SocketProvider>
      <SeasonalDecorations />
      <DevThemeTester />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/:roomId" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
      <Analytics />
    </SocketProvider>
  );
}

export default App;
