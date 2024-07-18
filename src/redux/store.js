import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import historicalDataReducer from './slices/historicalDataSlice';
import homeReducer from './slices/homeSlice';
import watchlistReducer from './slices/watchListSlice';
import themeReducer, { setTheme } from './slices/themeSlice'

const store = configureStore({
  reducer: {
    coins: coinsReducer,
    home: homeReducer,
    historicalData: historicalDataReducer,
    watchlist: watchlistReducer,
    theme: themeReducer,
  },
});

export default store;
