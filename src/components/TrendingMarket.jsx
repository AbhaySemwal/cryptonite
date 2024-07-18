'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingCoins } from '../redux/slices/coinsSlice';
import Link from 'next/link';

const TrendingMarket = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const { trendingCoins, trendingStatus, trendingError } = useSelector((state) => state.coins);
  const [showAll, setShowAll] = useState(false);

  const handleDragStart = (e, coin) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(coin));
  };

  useEffect(() => {
    if (trendingStatus === 'idle') {
      dispatch(fetchTrendingCoins());
    }
  }, [trendingStatus, dispatch]);

  if (trendingStatus === 'loading') {
    return <div className={`p-3 theme-transition ${isDarkMode?"text-white border-gray-600 bg-gray-950":"text-black bg-gray-100 border-gray-400"} border-[2px] rounded-lg `}>
      Loading trending coins...
    </div>;
  }

  if (trendingStatus === 'failed') {
    return <div className={`p-3 theme-transition ${isDarkMode?"text-white border-gray-600 bg-gray-950":"text-black bg-gray-100 border-gray-400"} border-[2px] rounded-lg `}>
      Error: {trendingError}
    </div>;
  }

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(8)}`;
    }
    return price || 'N/A';
  };

  const formatPercentage = (changeObj) => {
    if (changeObj && typeof changeObj.usd === 'number') {
      return `${changeObj.usd.toFixed(2)}%`;
    }
    return 'N/A';
  };

  const displayedCoins = showAll ? trendingCoins : trendingCoins.slice(0, 5);
  
  return (
    <div className={`theme-transition p-3 text-xs ${isDarkMode?"text-white border-gray-600 bg-gray-950":"text-black bg-gray-100 border-gray-400"} border-[2px] rounded-lg `}>
      <h1 className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">Trending</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-6 md:px-3 text-left">Token</th>
              <th className="py-2 px-3 text-left">Symbol</th>
              <th className="py-2 px-3 text-right">Last Price</th>
              <th className="py-2 px-3 text-right">24h Change</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {displayedCoins.map((coin) => (
              <tr key={coin.id} draggable onDragStart={(e) => handleDragStart(e, coin)} className={`${isDarkMode?"hover:bg-gray-900":"hover:bg-gray-200"} cursor-pointer`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <img className="w-6 h-6 rounded-full mr-2" src={coin.large} alt={coin.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-left">{coin.symbol}</td>
                <td className="py-2 px-3 text-right">{formatPrice(coin.data?.price)}</td>
                <td className={`py-2 px-3 text-right ${coin.data?.price_change_percentage_24h?.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.data?.price_change_percentage_24h)}
                </td>
                <td className="py-2 px-3 text-right">{coin.data?.market_cap || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {trendingCoins.length > 5 && (
        <div
            onClick={() => setShowAll(!showAll)}
            className={`theme-transition w-full text-center mt-2 font-bold py-1.5 px-2 rounded text-xs cursor-pointer ${isDarkMode?"text-white bg-gray-900":"text-black bg-gray-200"}`}
          >
            {showAll ? 'Show Less' : 'View More'}
        </div>
      )}
    </div>
  );
};

export default TrendingMarket;