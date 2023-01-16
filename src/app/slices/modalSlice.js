import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const type = action.payload;
      return [...state, { type }];
    },
    closeModal: (state, action) => {
      state.pop();
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
