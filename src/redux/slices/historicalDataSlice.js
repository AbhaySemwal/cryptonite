import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
const API_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-YAT6Xo52tQ3uFMoytsczBi1u';

export const fetchHistoricalData = createAsyncThunk('historicalData/fetchHistoricalData', async () => {
  const coins = ['bitcoin', 'ethereum', 'binancecoin'];
  const days = '30'; // Fetch data for the last 30 days
  const promises = coins.map((coin) =>
    api.get(`${API_URL}/coins/${coin}/market_chart`, 
      {
      params: {
        vs_currency: 'usd',
        days: days,
        api_key: API_KEY
      },
    })
  );

  const responses = await Promise.all(promises);
  const data = responses.map((response, index) => ({
    name: coins[index],
    prices: response.data.prices,
  }));

  return data;
});

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
        state.error = action.error.message;
      });
  },
});

export default historicalDataSlice.reducer;
