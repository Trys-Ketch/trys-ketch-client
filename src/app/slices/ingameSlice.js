import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stomp: null,
  id: '',
  socket: null,
};

const ingameSlice = createSlice({
  name: 'ingame',
  initialState,
  reducers: {
    setStomp: (state, action) => ({
      ...state,
      stomp: action.payload,
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
  },
  extraReducers: {},
});

export const { setStomp, setID, setSocket, closeSocket } = ingameSlice.actions;
export default ingameSlice.reducer;
