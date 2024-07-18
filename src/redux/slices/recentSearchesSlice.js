// redux/slices/recentSearchesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedSearches = localStorage.getItem('recentSearches');
    return savedSearches ? JSON.parse(savedSearches) : { searches: [] };
  }
  return { searches: [] };
};

const recentSearchesSlice = createSlice({
  name: 'recentSearches',
  initialState: getInitialState(),
  reducers: {
    addRecentSearch: (state, action) => {
      const newSearch = action.payload;
      state.searches = [newSearch, ...state.searches.filter(search => search.id !== newSearch.id)].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(state));
      }
    },
    clearRecentSearches: (state) => {
      state.searches = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('recentSearches');
      }
    },
  },
});

export const { addRecentSearch, clearRecentSearches } = recentSearchesSlice.actions;
export default recentSearchesSlice.reducer;