import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  id: '',
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
      id: '',
    }),
  },
  extraReducers: {},
});

export const { setSocket, closeSocket } = socketSlice.actions;
export default socketSlice.reducer;
