import { createSlice } from '@reduxjs/toolkit';
import DefaultImage from '../../assets/icons/user.png';

const initialState = {
  profileImage: DefaultImage,
  userId: '',
  nickname: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileImage: (state, action) => ({
      ...state,
      profileImage: action.payload,
    }),
    setUserId: (state, action) => ({
      ...state,
      userId: action.payload,
    }),
    setNickname: (state, action) => ({
      ...state,
      nickname: action.payload,
    }),
    setUserInfo: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setProfileImage, setUserId, setNickname, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
