'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCoinDetails, addToRecentlyViewed } from '@/redux/slices/coinsSlice';
import { fetchHistoricalData } from '@/redux/slices/historicalDataSlice';
import CoinPriceChart from '@/components/CoinPriceChart';
import CoinBarChart from '@/components/CoinBarChart';
import { setTheme } from '@/redux/slices/themeSlice';

const CoinPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isDarkMode,setIsDarkMode]=useState(true);
  const dm = useSelector((state) => state.theme.isDarkMode);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch,dm]);
  const coinData = useSelector((state) => state.coins.coinDetails[id]);
  const historicalData = useSelector((state) => state.historicalData.data.find((data) => data.name === id));

  const handleDragStart = (e) => {
    if (coinData) {
      const dragData = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        image: coinData.image.thumb,
        current_price: coinData.market_data.current_price.usd,
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
        market_cap: coinData.market_data.market_cap.usd,
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id)).then((action) => {
        if (action.payload) {
          const coinForRecentlyViewed = {
            id: action.payload.id,
            name: action.payload.name,
            symbol: action.payload.symbol,
            image: action.payload.image.thumb,
            market_cap_rank: action.payload.market_cap_rank,
            genesis_date: action.payload.genesis_date,
          };
          dispatch(addToRecentlyViewed(coinForRecentlyViewed));
        }
      });
      dispatch(fetchHistoricalData(id));
    }
  }, [dispatch, id]);

  // Format historical data for CoinPriceChart
  const formattedHistoricalData = historicalData?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp),
    price: price
  }));

  return (
    <div
    draggable
    onDragStart={handleDragStart}
     className="flex flex-col gap-5 mx-auto border-gray-400">
      <div className={`p-2 md:p-3 border-2 theme-transition ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <h1 className="text-lg md:text-2xl text-center mb-8 font-semibold uppercase">{id}</h1>
        {historicalData ? <CoinPriceChart isDarkMode={isDarkMode} coinId={id} historicalData={formattedHistoricalData} /> : <div>Loading...</div>}
      </div>
      <div className={`p-2 md:p-3 border-2 theme-transition ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <h2 className="text-lg md:text-2xl mb-4 text-center font-semibold">Price Change Percentages</h2>
        {coinData ? <CoinBarChart coinData={coinData} /> : <div>Loading...</div>}
      </div>
      
      {coinData && (
        <>
          <div className='flex md:flex-row flex-col gap-5 justify-between'>
            <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 theme-transition ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
              <h2 className="text-lg md:text-2xl font-semibold mb-4">Fundamentals</h2>
              <p className='py-1'><strong>Market Cap:</strong> {coinData.market_data.market_cap.usd}</p>
              <p className='py-1'><strong>Total Supply:</strong> {coinData.market_data.total_supply}</p>
              <p className='py-1'><strong>Max Supply:</strong> {coinData.market_data.max_supply}</p>
            </div>
            <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 theme-transition ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
              <h2 className="text-lg md:text-2xl font-semibold mb-4">Coin Information</h2>
              <p className='py-1'><strong>Symbol:</strong> {coinData.symbol}</p>
              <p className='py-1'><strong>Current Price:</strong> {coinData.market_data.current_price.usd}</p>
              <p className='py-1'><strong>Total Volume:</strong> {coinData.market_data.total_volume.usd}</p>
            </div>
          </div>
          <div className={`p-2 md:p-3 border-2 theme-transition ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} rounded-lg md:mb-5`}>
            <h2 className="text-lg md:text-2xl md:text-left text-center font-semibold mb-4">About {coinData.name}</h2>
            <p className='text-xs md:text-sm md:text-left text-center' dangerouslySetInnerHTML={{ __html: coinData.description.en }} />
          </div>
        </>
      )}
    </div>
  );
};

export default CoinPage;