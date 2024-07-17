import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import historicalDataReducer from './slices/historicalDataSlice';
import homeReducer from './slices/homeSlice';

const store = configureStore({
  reducer: {
    coins: coinsReducer,
    home: homeReducer,
    historicalData: historicalDataReducer,
  },
});

export default store;
