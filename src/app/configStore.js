import { combineReducers, configureStore } from '@reduxjs/toolkit';
import login from './slices/loginSlice';
import user from './slices/userSlice';

const rootReducer = combineReducers({
  login,
  user,
});

const store = configureStore({
  reducer: rootReducer,
  // middleware는 default 사용
});

export default store;
