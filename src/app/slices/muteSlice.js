import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const muteSlice = createSlice({
  name: 'mute',
  initialState,
  reducers: {
    setMuteUsers: (state, action) => ({
      ...state,
      users: [...action.payload],
    }),
    setMute: (state, action) => {
      const newUsers = [];
      for (let i = 0; i < state.users.length; i += 1) {
        if (state.users[i].socketID !== action.payload.socketID)
          newUsers.push({ ...state.users[i] });
        else newUsers.push({ ...state.users[i], isMuted: action.payload.isMuted });
      }
      return {
        ...state,
        users: newUsers,
        // users: state.users.filter((v) =>
        //   v.socketID !== action.payload.socketID
        //     ? { ...v }
        //     : { ...v, isMuted: action.payload.isMuted },
        // ),
      };
    },
  },
  extraReducers: {},
});

export const { setMuteUsers, setMute } = muteSlice.actions;
export default muteSlice.reducer;