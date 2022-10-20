import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  filterModalOpen: boolean
  createListingModalOpen: boolean
}

const initialState: UiState = {
  filterModalOpen: false,
  createListingModalOpen: false,
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
    createListingModalOpened: (state) => {
      state.createListingModalOpen = true;
    },
    createListingModalClosed: (state) => {
      state.createListingModalOpen = false;
    },
  },
});

export const {
  filterModalOpened, filterModalClosed, createListingModalOpened, createListingModalClosed,
} = uiSlice.actions;

export const selectUiState = (state: any) => state.ui;

export default uiSlice.reducer;
