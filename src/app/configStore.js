import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import login from './slices/loginSlice';
import user from './slices/userSlice';
import ingame from './slices/ingameSlice';
import modal from './slices/modalSlice';

const persistConfig = {
  key: 'root',
  // localStorage에 저장합니다.
  storage,
  // 여러개의 reducer 중에 todo reducer만 localstorage에 저장합니다.
  whitelist: ['login', 'user'],
  // blacklist -> 그것만 제외합니다
};

const rootReducer = combineReducers({
  login,
  user,
  ingame,
  modal,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
