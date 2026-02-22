import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from './groupsSlice';
import currencyReducer from './currencySlice';

const store = configureStore({
  reducer: {
    groups: groupsReducer,
    currency: currencyReducer,
  },
});

export default store;
