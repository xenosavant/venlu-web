import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './reducers/filtersReducer';
import listingReducer from './reducers/listingsReducer';
import uiReducer from './reducers/uiReducer';

const store = configureStore({
  reducer: {
    listing: listingReducer,
    filter: filtersReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
