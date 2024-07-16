// redux/slices/coinsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async (page) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
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
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
  return response.data
})

const coinsSlice = createSlice({
  name: 'coins',
  initialState: {
    coins: [],
    coinDetails: {},
    status: 'idle',
    error: null,
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
  }
})

export default coinsSlice.reducer
