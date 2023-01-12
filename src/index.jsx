import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import App from './App';
import theme from './styles/theme';
import Globalstyle from './styles/GlobalStyle';
import { store, persistor } from './app/configStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <Globalstyle />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
