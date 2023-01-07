import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Globalstyle from './styles/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Globalstyle />
    <App />
  </>,
);
