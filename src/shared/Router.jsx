import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Guest from '../pages/Guest';
import Login from '../pages/Login';
import Lobby from '../pages/Lobby';
// import MyPage from '../pages/MyPage';
import GameRoom from '../pages/GameRoom';
import AudioCall from '../components/webRTC/AudioCall.tsx';
import InGame from '../pages/InGame';
import Layout from '../components/layout/Layout';
import GameResult from '../pages/GameResult';
import BGM from '../components/layout/BGM';
import NotFound from '../pages/NotFound';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<BGM />}>
            <Route path="/" element={<Lobby />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:sns" element={<Login />} />
            <Route path="/guest" element={<Guest />} />
            {/* <Route path="/myPage" element={<MyPage />} /> */}
          </Route>
          <Route path="room" element={<Navigate to="/" replace />} />
          <Route element={<AudioCall />}>
            <Route path="/room/:id" element={<GameRoom />} />
            <Route path="/ingame/:id" element={<InGame />} />
            <Route path="/result/:id" element={<GameResult />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
