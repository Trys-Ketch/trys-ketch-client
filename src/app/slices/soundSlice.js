import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  volume: 0.5,
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    setVolume: (_, action) => ({
      volume: action.payload,
    }),
  },
});

export const { setVolume } = soundSlice.actions;
export default soundSlice.reducer;
