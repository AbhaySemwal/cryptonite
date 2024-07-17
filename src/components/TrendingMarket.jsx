'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingCoins } from '../redux/slices/coinsSlice';
import Link from 'next/link';

const TrendingMarket = () => {
  const dispatch = useDispatch();
  const { trendingCoins, trendingStatus, trendingError } = useSelector((state) => state.coins);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (trendingStatus === 'idle') {
      dispatch(fetchTrendingCoins());
    }
  }, [trendingStatus, dispatch]);

  if (trendingStatus === 'loading') {
    return <div className="text-white">Loading trending coins...</div>;
  }

  if (trendingStatus === 'failed') {
    return <div className="text-red-500">Error: {trendingError}</div>;
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
    <div className="p-3 text-xs text-white border-[2px] rounded-lg border-gray-600 bg-gray-950">
      <h1 className="text-xl font-bold mb-4">Trending</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-left">Symbol</th>
              <th className="py-2 px-3 text-right">Last Price</th>
              <th className="py-2 px-3 text-right">24h Change</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {displayedCoins.map((coin) => (
              <tr key={coin.id} className="hover:bg-gray-900 cursor-pointer">
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

export default TrendingMarket;