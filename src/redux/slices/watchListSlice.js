import { createSlice } from '@reduxjs/toolkit';

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: [],
  reducers: {
    setWatchlist: (state, action) => {
      return action.payload;
    },
    addToWatchlist: (state, action) => {
      const index = state.findIndex(coin => coin.id === action.payload.id);
      if (index !== -1) {
        // If the coin already exists, update its data
        state[index] = { ...state[index], ...action.payload };
      } else {
        // If it's a new coin, add it to the watchlist
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