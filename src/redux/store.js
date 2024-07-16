// redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import coinsReducer from './slices/coinsSlice'

const store = configureStore({
  reducer: {
    coins: coinsReducer,
  },
})

export default store
