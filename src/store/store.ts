import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import filtersReducer from '../features/filter/filtersReducer';
import listingReducer from '../features/listings/listingsReducer';

import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  listing: listingReducer,
  filter: filtersReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;

export const setupStore = (preloadedState?: PreloadedState<Partial<RootState>>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export default store;
