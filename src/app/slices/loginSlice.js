import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  member: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (_, payload) => ({
      member: payload,
      isLogin: true,
    }),
    setLogout: () => ({
      member: null,
      isLogin: false,
    }),
  },
  extraReducers: {},
});

export const { setLogin, setLogout } = loginSlice.actions;
export default loginSlice.reducer;
