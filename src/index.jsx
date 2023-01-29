import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import ReactGA from 'react-ga4';
import ToastProvider from './components/toast/ToastProvider';
import App from './App';
import theme from './styles/theme';
import Globalstyle from './styles/GlobalStyle';
import { store, persistor } from './app/configStore';
import './styles/font.css';

if (process.env.REACT_APP_GOOGLE_ANALYSTICS_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYSTICS_ID);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <ToastProvider />
        <Globalstyle />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
