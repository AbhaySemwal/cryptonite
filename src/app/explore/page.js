'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchCoins } from '@/redux/slices/coinsSlice';

const ExplorePage = () => {
  const dispatch = useDispatch();
  const { coins, status, error } = useSelector((state) => state.coins);
  const [page, setPage] = useState(1);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  useEffect(() => {
    dispatch(fetchCoins(page));
  }, [dispatch, page]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(2) + '%';
  };

  const formatPrice = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`p-3 text-xs border-[2px] rounded-lg ${isDarkMode?"bg-gray-950 border-gray-600":"bg-gray-100 border-gray-400"}`}>
      <h1 className="text-xl font-bold md:text-left text-center mb-4">Explore</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
              <th className="py-2 px-3 text-right">Balance</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Today</th>
              <th className="py-2 px-3 text-right">7D</th>
              <th className="py-2 px-3 text-right">30D</th>
              <th className="py-2 px-3 text-right">1Y</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {coins.map((coin) => (
              <tr key={coin.id} className={`${isDarkMode?"hover:bg-gray-900":"hover:bg-gray-200"} cursor-pointer`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <img className="w-6 h-6 rounded-full mr-2" src={coin.image} alt={coin.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">{formatPrice(coin.market_cap)}</td>
                <td className="py-2 px-3 text-right">{coin.circulating_supply?.toLocaleString() || 'N/A'}</td>
                <td className="py-2 px-3 text-right">{formatPrice(coin.current_price)}</td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_7d)}
                </td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_30d)}
                </td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_1y)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs disabled:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
