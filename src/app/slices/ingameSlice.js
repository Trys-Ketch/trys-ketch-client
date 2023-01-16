import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stomp: null,
  id: '',
};

const ingameStompSlice = createSlice({
  name: 'stomp',
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
  },
  extraReducers: {},
});

export const { setStomp, setID } = ingameStompSlice.actions;
export default ingameStompSlice.reducer;
