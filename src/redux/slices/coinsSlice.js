import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithCache } from '@/lib/api';

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async (page) => {
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 20,
    page,
    sparkline: false
  };
  return await fetchWithCache('/coins/markets', params);
});

export const fetchCoinDetails = createAsyncThunk('coins/fetchCoinDetails', async (id) => {
  return await fetchWithCache(`/coins/${id}`);
});

export const addToRecentlyViewed = createAsyncThunk(
  'coins/addToRecentlyViewed',
  async (coin, { getState }) => {
    const { coins } = getState();
    let recentlyViewed = [...coins.recentlyViewed];
    
    recentlyViewed = recentlyViewed.filter(c => c.id !== coin.id);
    recentlyViewed.unshift(coin);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
    
    return recentlyViewed;
  }
);

export const removeFromRecentlyViewed = createAsyncThunk(
  'coins/removeFromRecentlyViewed',
  async (coinId, { getState }) => {
    const { coins } = getState();
    let recentlyViewed = coins.recentlyViewed.filter(coin => coin.id !== coinId);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
    
    return recentlyViewed;
  }
);

export const initializeRecentlyViewed = createAsyncThunk(
  'coins/initializeRecentlyViewed',
  async () => {
    if (typeof window !== 'undefined') {
      const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
      return storedRecentlyViewed ? JSON.parse(storedRecentlyViewed) : [];
    }
    return [];
  }
);

export const fetchTrendingCoins = createAsyncThunk(
  'coins/fetchTrendingCoins',
  async () => {
    const data = await fetchWithCache('/search/trending');
    return data.coins.map(item => item.item);
  }
);

const coinsSlice = createSlice({
  name: 'coins',
  initialState: {
    coins: [],
    coinDetails: {},
    recentlyViewed: [],
    status: 'idle',
    error: null,
    trendingCoins: [],
    trendingStatus: 'idle',
    trendingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coinDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      })
      .addCase(removeFromRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      })
      .addCase(initializeRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      })
      .addCase(fetchTrendingCoins.pending, (state) => {
        state.trendingStatus = 'loading';
      })
      .addCase(fetchTrendingCoins.fulfilled, (state, action) => {
        state.trendingStatus = 'succeeded';
        state.trendingCoins = action.payload;
      })
      .addCase(fetchTrendingCoins.rejected, (state, action) => {
        state.trendingStatus = 'failed';
        state.trendingError = action.error.message;
      });
  }
});

export default coinsSlice.reducer;
