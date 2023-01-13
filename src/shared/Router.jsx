import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Guest from '../pages/Guest';
import Login from '../pages/Login';
import Lobby from '../pages/Lobby';
import MyPage from '../pages/MyPage';
import GameRoom from '../pages/GameRoom';
import AudioCall from '../components/webRTC/AudioCall.tsx';
import InGame from '../pages/InGame';
import Layout from '../components/layout/Layout';

function Router() {
  return (
    <BrowserRouter>
      {/* <AudioCall /> */}
      <Routes>
<<<<<<< HEAD
        <Route element={<Layout />}>
          <Route path="/" element={<Lobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="room" element={<Navigate to="/" replace />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/video/:id" element={<AudioCall />} />
          <Route path="room/:id" element={<AudioCall />} />
          <Route path="/ingame/:id" element={<InGame />} />
        </Route>
=======
        <Route path="/" element={<Lobby />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="room" element={<Navigate to="/" replace />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/video/:id" element={<AudioCall />} />
        {/* <Route path="/room" element={<AudioCall />}> */}
        <Route
          path="/room/:id"
          element={
            <>
              <GameRoom />
              <AudioCall />
            </>
          }
        />
        {/* </Route> */}
        <Route path="/ingame/:id" element={<InGame />} />
>>>>>>> 7520b00 (:truck: Render AudioCall multiple page)
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
