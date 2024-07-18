// redux/slices/coinsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/axios'

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async (page) => {
  const response = await api.get(`https://api.coingecko.com/api/v3/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page,
      sparkline: false
    }
  })
  return response.data
})

export const fetchCoinDetails = createAsyncThunk('coins/fetchCoinDetails', async (id) => {
  const response = await api.get(`https://api.coingecko.com/api/v3/coins/${id}`)
  return response.data
})

export const addToRecentlyViewed = createAsyncThunk(
  'coins/addToRecentlyViewed',
  async (coin, { getState }) => {
    const { coins } = getState();
    let recentlyViewed = [...coins.recentlyViewed];
    
    recentlyViewed = recentlyViewed.filter(c => c.id !== coin.id);
    recentlyViewed.unshift(coin);
    recentlyViewed = recentlyViewed.slice(0, 5);
    
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
    const response = await api.get('https://api.coingecko.com/api/v3/search/trending');
    return response.data.coins.map(item => item.item);
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
        state.status = 'loading'
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.coins = action.payload
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.coinDetails[action.payload.id] = action.payload
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
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
})

export default coinsSlice.reducer
