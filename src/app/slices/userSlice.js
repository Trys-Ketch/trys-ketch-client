import { createSlice } from '@reduxjs/toolkit';

// 게임에 따라서 유저정보 추가 관리 필요
const initialState = {
  nickname: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNickname: (state, action) => ({
      ...state,
      nickname: action.payload,
    }),
  },
  extraReducers: {},
});

export const { setNickname } = userSlice.actions;
export default userSlice.reducer;
