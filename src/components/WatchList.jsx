'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoins } from '../redux/slices/coinsSlice';
import Link from 'next/link';

const WatchList = () => {
  const dispatch = useDispatch();
  const { coins, status, error } = useSelector((state) => state.coins);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCoins(1)); // Fetch the first page of coins
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const displayedCoins = showAll ? coins : coins.slice(0, 5);

  return (
    <div className="p-3 text-xs text-white border-[2px] rounded-lg border-gray-600 bg-gray-950">
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
              <tr key={coin.id} className="hover:bg-gray-900 cursor-pointer">
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <img className="w-6 h-6 rounded-full mr-2" src={coin.image} alt={coin.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-2 px-3 text-right">
                  ${coin.market_cap.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {coins.length > 5 && (
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