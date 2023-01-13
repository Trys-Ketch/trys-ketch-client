import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => ({
      ...state,
      socket: action.payload,
    }),
    closeSocket: (state) => ({
      ...state,
      socket: null,
    }),
  },
  extraReducers: {},
});

export const { setSocket, closeSocket } = socketSlice.actions;
export default socketSlice.reducer;
