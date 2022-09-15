import { configureStore } from '@reduxjs/toolkit'
import listingReducer from './reducers/listingsReducer';

const store = configureStore({
  reducer: {
    listing: listingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;