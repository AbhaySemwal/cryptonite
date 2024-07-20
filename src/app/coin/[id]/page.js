"use client"
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCoinDetails, addToRecentlyViewed } from '@/redux/slices/coinsSlice';
import { fetchHistoricalData } from '@/redux/slices/historicalDataSlice';
import CoinPriceChart from '@/components/CoinPriceChart';
import CoinBarChart from '@/components/CoinBarChart';
import { setTheme } from '@/redux/slices/themeSlice';
import Image from 'next/image';
import LivePriceService from '@/services/LivePriceService';
import PubSub from '@/services/PubSub';

const formatPrice = (value) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = Number(value);
  return isNaN(numValue) ? 'N/A' : '$' + numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const LivePriceDisplay = React.memo(({ price }) => (
  <div className='flex gap-2 items-center'>
    <div className='px-1 py-0.5 border-[2px] border-gray-400 rounded-md text-xs flex gap-1 items-center font-semibold'>Live <span className='text-[8px]'>🟢</span></div>
    <p className='font-semibold md:text-lg'>{formatPrice(price)}</p>
  </div>
));

const CoinPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [livePrice, setLivePrice] = useState(null);
  const dm = useSelector((state) => state.theme.isDarkMode);
  const coinData = useSelector((state) => state.coins.coinDetails[id]);
  const historicalData = useSelector((state) => state.historicalData.data.find((data) => data.name === id));

  const livePriceRef = useRef(null);

  const handleDragStart = useCallback((e) => {
    if (coinData) {
      const dragData = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        image: coinData.image.thumb,
        current_price: livePriceRef.current || coinData.market_data.current_price.usd,
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
        market_cap: coinData.market_data.market_cap.usd,
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
  }, [coinData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch, dm]);

  useEffect(() => {
    let unsubscribe;

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
          console.log(action.payload)
          dispatch(addToRecentlyViewed(coinForRecentlyViewed));

          const initialPrice = action.payload.market_data.current_price.usd;
          setLivePrice(initialPrice);
          livePriceRef.current = initialPrice;
          
          LivePriceService.startUpdates(id, initialPrice);
          unsubscribe = PubSub.subscribe('priceUpdate', ({ coinId, price }) => {
            if (coinId === id) {
              livePriceRef.current = price;
              setLivePrice(price);
            }
          });
        }
      });
      dispatch(fetchHistoricalData(id));
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (id) LivePriceService.stopUpdates(id);
    };
  }, [dispatch, id]);
  // useEffect(()=>{
    // console.log(livePrice)
  // },[livePrice])
  const formattedHistoricalData = useMemo(() => 
    historicalData?.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price: price
    })), [historicalData]);

  const displayedPrice = livePrice || (coinData && coinData.market_data.current_price.usd);
  
  return (
    <div className="flex flex-col gap-5 mx-auto border-gray-400">
      <div className={`p-2 md:p-3 border-2 theme-transition justify-between ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <div className='flex justify-between items-center mb-2'>
          <div
            draggable={coinData ? true : false}
            onDragStart={handleDragStart}
            className='flex gap-2 items-center'>
            {coinData?.image?.thumb && <Image className='h-10 w-10 rounded-full border-[1px] border-gray-500 object-cover' height={1000} width={1000} src={coinData?.image?.thumb} alt={coinData?.name} />}
            <h1 className="text-lg md:text-xl text-center md:text-left font-semibold uppercase">{id}</h1>
          </div>
          {displayedPrice !== undefined && (
        <LivePriceDisplay price={displayedPrice} />
      )}
        </div>
        {historicalData ? <CoinPriceChart isDarkMode={isDarkMode} coinId={id} historicalData={formattedHistoricalData} /> : <div>Loading Chart...</div>}
      </div>
      <div className={`p-2 md:p-3 border-2 theme-transition ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <h2 className="text-lg md:text-xl mb-4 text-center md:text-left font-semibold">Price Change Percentages</h2>
        {coinData ? <CoinBarChart isDarkMode={isDarkMode} coinData={coinData} /> : <div>Loading...</div>}
      </div>
      {coinData && (
        <>
          <div className='flex md:flex-row flex-col gap-5 justify-between'>
            <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 theme-transition ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Fundamentals</h2>
              <p className='py-1'><strong>Market Cap:</strong> {formatPrice(coinData.market_data.market_cap.usd)}</p>
              <p className='py-1'><strong>Total Supply:</strong> {formatPrice(coinData.market_data.total_supply)}</p>
              <p className='py-1'><strong>Max Supply:</strong> {formatPrice(coinData.market_data.max_supply)}</p>
            </div>
            <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 theme-transition ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Coin Information</h2>
              <p className='py-1'><strong>Symbol:</strong> {coinData.symbol}</p>
              <p className='py-1'><strong>Current Price:</strong> {formatPrice(displayedPrice)}</p>
              <p className='py-1'><strong>Total Volume:</strong> {formatPrice(coinData.market_data.total_volume.usd)}</p>
            </div>
          </div>
          <div className={`p-2 md:p-3 border-2 theme-transition ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg md:mb-5`}>
            <h2 className="text-lg md:text-xl md:text-left text-center font-semibold mb-4">About {coinData.name}</h2>
            <p className='text-xs md:text-sm md:text-left text-center' dangerouslySetInnerHTML={{ __html: coinData.description.en }} />
          </div>
        </>
      )}
    </div>
  );
};

export default CoinPage;