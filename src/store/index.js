import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from './groupsSlice';

const store = configureStore({
  reducer: {
    groups: groupsReducer,
  },
});

export default store;
