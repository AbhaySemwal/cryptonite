import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithCache } from '@/lib/api';

const API_URL = 'https://api.coingecko.com/api/v3';

// Async thunk to fetch historical data
export const fetchHistoricalData = createAsyncThunk(
  'historicalData/fetchHistoricalData',
  async ({ coins, days }, { rejectWithValue }) => {
    try {
      const promises = coins.map((coin) =>
        fetchWithCache(`${API_URL}/coins/${coin}/market_chart`, {
          vs_currency: 'usd',
          days: days,
        })
      );

      const responses = await Promise.all(promises);
      const data = responses.map((response, index) => ({
        name: coins[index],
        prices: response.prices,
      }));

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const historicalDataSlice = createSlice({
  name: 'historicalData',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoricalData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default historicalDataSlice.reducer;
