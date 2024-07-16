import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import historicalDataReducer from './slices/historicalDataSlice';

const store = configureStore({
  reducer: {
    coins: coinsReducer,
    historicalData: historicalDataReducer,
  },
});

export default store;
