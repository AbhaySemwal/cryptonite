'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToRecentlyViewed, fetchCoinDetails } from '@/redux/slices/coinsSlice';

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const [showAll,setShowAll]=useState(false)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { recentlyViewed, coinDetails } = useSelector((state) => state.coins);

  useEffect(() => {
    const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    storedRecentlyViewed.forEach(coin => dispatch(addToRecentlyViewed(coin)));
  }, [dispatch]);

  useEffect(() => {
    recentlyViewed.forEach(coin => {
      if (!coinDetails[coin.id]) {
        dispatch(fetchCoinDetails(coin.id));
      }
    });
  }, [recentlyViewed, dispatch, coinDetails]);

  if (recentlyViewed.length === 0) {
    return <p>No recently viewed cryptocurrencies.</p>;
  }
  const displayedCoins = showAll ? recentlyViewed : recentlyViewed.slice(0, 5);
  return (
    <div className={`p-3 text-xs border-[2px] rounded-lg ${isDarkMode?"text-white border-gray-600 bg-gray-950":"text-black bg-gray-100 border-gray-400"}`}>
      <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Rank</th>
              <th className="py-2 px-3 text-right">Genesis Date</th>
              <th className="py-2 px-3 text-right">Current Price</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {displayedCoins.map((coin) => {
              const currentData = coinDetails[coin.id];
              return (
                <tr key={coin.id} className={`${isDarkMode?"hover:bg-gray-900":"hover:bg-gray-200"} cursor-pointer`}>
                  <td className="py-2 px-3 text-left whitespace-nowrap">
                    <Link href={`/coin/${coin.id}`} className="flex items-center group">
                      <img className="w-6 h-6 rounded-full mr-2" src={coin.image} alt={coin.name} />
                      <span className="font-medium text-blue-400 group-hover:text-blue-300">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {coin.market_cap_rank}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {coin.genesis_date || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {currentData ? `$${currentData.market_data.current_price.usd.toLocaleString()}` : 'Loading...'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayedCoins.length > 5 && (
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
    </div>
  );
};

export default RecentlyViewed;