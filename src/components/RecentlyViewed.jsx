'use client';

import { addToRecentlyViewed, fetchCoinDetails } from '@/redux/slices/coinsSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { addToRecentlyViewed, fetchCoinData } from '../redux/slices/coinsSlice';

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const { recentlyViewed } = useSelector((state) => state.coins);
  const [updatedCoins, setUpdatedCoins] = useState([]);

  useEffect(() => {
    // Load recently viewed coins from local storage on component mount
    const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    storedRecentlyViewed.forEach(coin => dispatch(addToRecentlyViewed(coin)));
  }, [dispatch]);

  useEffect(() => {
    // Fetch updated data for each coin
    const fetchUpdatedData = async () => {
      const updatedData = await Promise.all(
        recentlyViewed.map(coin => dispatch(fetchCoinDetails(coin.id)))
      );
      setUpdatedCoins(updatedData.map(result => result.payload));
    };

    if (recentlyViewed.length > 0) {
      fetchUpdatedData();
    }
  }, [recentlyViewed, dispatch]);

  if (updatedCoins.length === 0) {
    return <div className="text-center py-4 text-white">No recently viewed cryptocurrencies.</div>;
  }

  
  return (
    <div className="p-3 text-xs text-white border-[2px] rounded-lg border-gray-600 bg-gray-950">
      <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Last Price</th>
              <th className="py-2 px-3 text-right">24h Change</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {updatedCoins.map((coin) => (
              <tr key={coin?.id} className="hover:bg-gray-900 cursor-pointer">
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin?.id}`} className="flex items-center group">
                    <img className="w-6 h-6 rounded-full mr-2" src={coin?.image.thumb} alt={coin?.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin?.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">
                  ${coin?.market_data.current_price.usd.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin?.market_data.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-2 px-3 text-right">
                  ${coin?.market_data.market_cap.usd.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentlyViewed;