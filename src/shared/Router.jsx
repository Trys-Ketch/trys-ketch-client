import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Guest from '../pages/Guest';
import Login from '../pages/Login';
import Main from '../pages/Main';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<Guest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
