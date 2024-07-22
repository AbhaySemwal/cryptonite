'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeRecentlyViewed, removeFromRecentlyViewed, fetchCoinDetails } from '@/redux/slices/coinsSlice';
import { Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { setTheme } from '@/redux/slices/themeSlice';
import Image from 'next/image';

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dm = useSelector((state) => state.theme.isDarkMode);
  const { recentlyViewed, coinDetails } = useSelector((state) => state.coins);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    dispatch(initializeRecentlyViewed()).then(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    recentlyViewed.forEach((coin) => {
      if (!coinDetails[coin.id] || Date.now() - coinDetails[coin.id].lastUpdated > 60000) {
        dispatch(fetchCoinDetails(coin.id));
      }
    });
  }, [recentlyViewed, dispatch, coinDetails]);

  if (recentlyViewed.length === 0) {
    return (
      <div className={`p-3 text-center border-[2px] rounded-lg theme-transition ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"}`}>
        No recently viewed cryptocurrencies.
      </div>
    );
  }

  const handleRemoveCoin = (coinId, e) => {
    e.stopPropagation();
    dispatch(removeFromRecentlyViewed(coinId));
  };

  const handleClick = (id) => {
    router.push("/coin/" + id);
  };

  const displayedCoins = showAll ? recentlyViewed : recentlyViewed.slice(0, 5);

  const formatPrice = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(2) + '%';
  };

  const handleDragStart = (e, coin) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(coin));
  };

  return (
    <div className={`theme-transition p-2 md:p-3 text-xs border-[2px] rounded-lg ${isDarkMode ? "text-white border-gray-600 bg-gray-950" : "text-black bg-gray-100 border-gray-400"}`}>
      <h2 className="md:text-xl text-lg font-bold mb-4 text-center md:text-left">Recently Viewed</h2>
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
            {displayedCoins.map((coin) => {
              const currentData = coinDetails[coin.id];
              return (
                <tr key={coin.id} draggable onDragStart={(e) => handleDragStart(e, currentData)} onClick={() => handleClick(coin.id)} className={`${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-200"} cursor-pointer`}>
                  <td className="py-2 px-3 text-left whitespace-nowrap">
                    <div className="flex items-center group">
                      <Image height={1000} width={1000} className="w-6 h-6 rounded-full mr-2" src={coin.image} alt={coin.name} />
                      <span className="font-medium text-blue-500 group-hover:text-blue-400">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {currentData ? formatPrice(currentData.market_data.current_price.usd) : 'Loading...'}
                  </td>
                  <td className={`py-2 px-3 text-right ${currentData && currentData.market_data.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {currentData ? formatPercentage(currentData.market_data.price_change_percentage_24h) : 'Loading...'}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {currentData ? formatPrice(currentData.market_data.market_cap.usd) : 'Loading...'}
                  </td>
                  <td className='py-2 text-right'>
                    <button
                      onClick={(e) => handleRemoveCoin(coin.id, e)}
                      className={`flex items-center justify-center font-semibold rounded-full theme-transition ${isDarkMode ? 'text-gray-700 hover:text-gray-600' : 'text-gray-500 hover:text-gray-600'}`}
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {recentlyViewed.length > 5 && (
          <div
            onClick={() => setShowAll(!showAll)}
            className={`w-full text-center mt-2 font-bold py-1.5 px-2 rounded text-xs cursor-pointer theme-transition ${isDarkMode ? "text-white bg-gray-900" : "text-black bg-gray-200"}`}
          >
            {showAll ? 'Show Less' : 'View More'}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;