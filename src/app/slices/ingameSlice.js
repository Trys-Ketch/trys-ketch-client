import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stomp: null,
  id: '',
  socket: null,
  isHost: false,
  forceSubmit: false,
  reconnect: () => {},
};

const ingameSlice = createSlice({
  name: 'ingame',
  initialState,
  reducers: {
    setStomp: (state, action) => ({
      ...state,
      stomp: action.payload,
    }),
    closeStomp: (state) => ({
      ...state,
      stomp: null,
    }),
    setID: (state, action) => ({
      ...state,
      id: action.payload,
    }),
    setSocket: (state, action) => ({
      ...state,
      socket: action.payload,
    }),
    closeSocket: (state) => ({
      ...state,
      socket: null,
      id: '',
    }),
    setIngameHost: (state, action) => ({
      ...state,
      isHost: action.payload,
    }),
    setForceSubmit: (state, action) => ({
      ...state,
      forceSubmit: action.payload,
    }),
    setReconnect: (state, action) => ({
      ...state,
      // reconnect: action.payload,
    }),
  },
  extraReducers: {},
});

export const {
  setStomp,
  setID,
  setSocket,
  closeSocket,
  closeStomp,
  setIngameHost,
  setForceSubmit,
  setReconnect,
} = ingameSlice.actions;
export default ingameSlice.reducer;
