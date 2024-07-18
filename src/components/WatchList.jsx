'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { addToWatchlist, setWatchlist } from '@/redux/slices/watchListSlice';
import { addToRecentlyViewed } from '@/redux/slices/coinsSlice';

const WatchList = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const watchlist = useSelector((state) => state.watchlist) || [];
  const [showAll, setShowAll] = useState(false);

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
    if (!watchlist.some(coin => coin.id === coinData.id)) {
      dispatch(addToWatchlist(coinData));
      dispatch(addToRecentlyViewed(coinData));
      const newWatchlist = [...watchlist, coinData];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedRecentlyViewed = [coinData, ...recentlyViewed.filter(coin => coin.id !== coinData.id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
    }
  };

  if (watchlist.length === 0) {
    return (
      <div 
        className={`p-3 text-xs border-[2px] rounded-lg ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"} min-h-[200px] flex items-center justify-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Drag and drop coins here to add to your watchlist
      </div>
    );
  }

  const displayedCoins = showAll ? watchlist : watchlist.slice(0, 5);

  return (
    <div 
      className={`p-3 text-xs border-[2px] rounded-lg ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"}`}
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
              <tr key={coin?.id} className={`${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"} cursor-pointer`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin?.id}`} className="flex items-center group">
                    <img className="w-6 h-6 rounded-full mr-2" src={coin?.large} alt={coin?.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">
                  ${parseFloat(coin?.data.price).toFixed(8)}
                </td>
                <td className={`py-2 px-3 text-right ${coin?.data.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin?.data.price_change_percentage_24h.usd.toFixed(2)}%
                </td>
                <td className="py-2 px-3 text-right">
                  {coin?.data.market_cap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {watchlist.length > 5 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            {showAll ? 'Show Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchList;