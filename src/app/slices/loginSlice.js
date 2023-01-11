import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  member: '',
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (_, action) => ({
      member: action.payload,
      isLogin: true,
    }),
    setLogout: () => ({
      member: '',
      isLogin: false,
    }),
  },
  extraReducers: {},
});

export const { setLogin, setLogout } = loginSlice.actions;
export default loginSlice.reducer;
