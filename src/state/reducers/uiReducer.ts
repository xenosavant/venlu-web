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
      console.log('fmo')
      state.filterModalOpen = true;
    },
    filterModalClosed: (state) => {
      state.filterModalOpen = false;
    },
    createListingModalOpened: (state) => {
      console.log('clmo')
      state.createListingModalOpen = true;
    },
    createListingModalClosed: (state) => {
      console.log('clmc')
      state.createListingModalOpen = false;
    },
  },
});

export const {
  filterModalOpened, filterModalClosed, createListingModalOpened, createListingModalClosed,
} = uiSlice.actions;

export const selectUiState = (state: any) => state.ui;

export default uiSlice.reducer;
