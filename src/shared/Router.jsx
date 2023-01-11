import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Guest from '../pages/Guest';
import Login from '../pages/Login';
import Lobby from '../pages/Lobby';
import MyPage from '../pages/MyPage';
import GameRoom from '../pages/GameRoom';
import AudioCall from '../components/webRTC/AudioCall.tsx';
import InGame from '../pages/InGame';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="room" element={<Navigate to="/" replace />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/video/:roomName" element={<AudioCall />} />
      </Routes>
      <AudioCall />
      <Routes>
        <Route path="room/:id" element={<GameRoom />} />
        <Route path="/ingame/:id" element={<InGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
