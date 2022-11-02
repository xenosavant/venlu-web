import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../features/filter/filtersReducer';
import listingReducer from '../features/listings/listingsReducer';

import uiReducer from './reducers/uiReducer';

const store = configureStore({
  reducer: {
    listing: listingReducer,
    filter: filtersReducer,
    ui: uiReducer,
  },
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
