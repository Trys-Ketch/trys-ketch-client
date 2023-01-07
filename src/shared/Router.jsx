import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Guest from '../pages/Guest';
import Login from '../pages/Login';
import Lobby from '../pages/Lobby';
import MyPage from '../pages/MyPage';
import GameRoom from '../pages/GameRoom';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="room" element={<Navigate to="/" replace />} />
        <Route path="room/:id" element={<GameRoom />} />
        <Route path="/myPage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
