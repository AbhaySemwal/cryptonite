'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { addToWatchlist, setWatchlist, removeFromWatchlist } from '@/redux/slices/watchListSlice';
import { setTheme } from '@/redux/slices/themeSlice';
import { Close as CloseIcon, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const WatchList = () => {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dm = useSelector((state) => state.theme.isDarkMode);
  const watchlist = useSelector((state) => state.watchlist) || [];
  const [showAll, setShowAll] = useState(false);
  const router=useRouter();

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
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    dispatch(setWatchlist(storedWatchlist));
  }, [dispatch]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const coinData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    dispatch(addToWatchlist(coinData));
    
    // Update the local storage
    const updatedWatchlist = watchlist.map(coin => 
      coin.id === coinData.id ? { ...coin, ...coinData } : coin
    );
    
    if (!watchlist.some(coin => coin.id === coinData.id)) {
      updatedWatchlist.push(coinData);
    }
    
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };
  const handleRemoveCoin = (coinId, e) => {
    e.stopPropagation();
    dispatch(removeFromWatchlist(coinId));
    const newWatchlist = watchlist.filter(coin => coin.id !== coinId);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  if (watchlist.length === 0) {
    return (
      <div 
        className={`mb-5 theme-transition p-3 border-[2px] text-center rounded-lg ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"} min-h-[200px] flex items-center justify-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Drag and drop coins here to add to your watchlist
      </div>
    );
  }

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(2) + '%';
  };

  const formatPrice = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return ((String(value)[0]!='$'?'$':'') + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleClick = (id) => {
    router.push("/coin/" + id);
  };
  const displayedCoins = showAll ? watchlist : watchlist.slice(0, 5);
  console.log(displayedCoins)
  return (
    <div 
      className={`theme-transition p-2 md:p-3 text-xs border-[2px] mb-5 rounded-lg ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h1 className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">Watchlist</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 md:px-3 px-6 text-left">Token</th>
              <th className="py-2 px-3 text-right">Last Price</th>
              <th className="py-2 px-3 text-right">24h Change</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {displayedCoins.map((coin) => (
              <tr key={coin?.id} onClick={() => handleClick(coin.id)} className={`theme-transition cursor-pointer ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"}`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <div className="flex items-center group">
                    <Image height={1000} width={1000} className="w-6 h-6 rounded-full mr-2" src={coin?.large || coin?.image?.large || coin?.image?.thumb || coin?.image} alt={coin?.name} />
                    <span className="font-medium text-blue-500 group-hover:text-blue-400">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right">
                {coin?.data?.price
                    ? formatPrice(coin?.data?.price)
                    : coin?.current_price
                      ? formatPrice(coin?.current_price)
                      : coin.market_data?.current_price?.usd
                        ? formatPrice(coin.market_data.current_price.usd)
                        : 'N/A'}
                </td>
                <td className={`py-2 px-3 text-right ${
                  (coin?.data?.price_change_percentage_24h?.usd || coin?.price_change_percentage_24h || coin.market_data?.price_change_percentage_24h || 0) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {coin.data
                    ? formatPercentage(coin.data.price_change_percentage_24h.usd)
                    : coin.price_change_percentage_24h
                      ? formatPercentage(coin.price_change_percentage_24h)
                      : coin.market_data?.price_change_percentage_24h
                        ? formatPercentage(coin.market_data.price_change_percentage_24h)
                        : 'N/A'}
                </td>
                <td className="py-2 px-3 text-right">
                  {coin?.data?.market_cap
                    ? formatPrice(coin.data.market_cap)
                    : coin?.market_cap
                      ? formatPrice(coin.market_cap)
                      : coin.market_data?.market_cap?.usd
                        ? formatPrice(coin.market_data.market_cap.usd)
                        : 'N/A'}
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={(e) => handleRemoveCoin(coin.id, e)}
                    className={`flex items-center justify-center font-semibold rounded-full theme-transition ${isDarkMode ? 'text-gray-700 hover:text-gray-600' : 'text-gray-500 hover:text-gray-600'}`}
                  >
                    <Delete />
                  </button>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
      {watchlist.length > 5 && (
        <div
            onClick={() => setShowAll(!showAll)}
            className={`w-full text-center mt-2 font-bold py-1.5 px-2 rounded text-xs cursor-pointer theme-transition ${isDarkMode?"text-white bg-gray-900":"text-black bg-gray-200"}`}
          >
            {showAll ? 'Show Less' : 'View More'}
        </div>
      )}
    </div>
  );
};

export default WatchList;