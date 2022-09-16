import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  filterModalOpen: boolean
}

const initialState: UiState = {
  filterModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    filterModalOpened: (state) => {
      state.filterModalOpen = true;
    },
    filterModalClosed: (state) => {
      state.filterModalOpen = false;
    },
  },
});

export const { filterModalOpened, filterModalClosed } = uiSlice.actions;

export const selectUiState = (state: any) => state.ui;

export default uiSlice.reducer;
