import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './reducers/filtersReducer';
import listingReducer from './reducers/listingsReducer';

const store = configureStore({
  reducer: {
    listing: listingReducer,
    filter: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
