import { createSlice } from '@reduxjs/toolkit';

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: [],
  reducers: {
    setWatchlist: (state, action) => {
      return action.payload;
    },
    addToWatchlist: (state, action) => {
      if (!state.some(coin => coin.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      return state.filter(coin => coin.id !== action.payload);
    },
  },
});

export const { setWatchlist, addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;