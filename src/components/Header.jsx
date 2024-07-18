// components/Header.js
'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Search, WbSunny, Brightness2 } from '@mui/icons-material';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '@/redux/slices/themeSlice';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isDarkMode,setIsDarkMode]=useState(true);
  const dm = useSelector((state) => state.theme.isDarkMode);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch,dm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchCoins();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchCoins = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
      setSearchResults(response.data.coins.slice(0, 5));
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching coins:', error);
    }
  };

  const handleCoinSelect = (id) => {
    router.push(`/coin/${id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className={`p-3 py-2 md:py-3 md:px-5 flex items-center justify-between ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
      <Link href="/"><Image className='h-8 w-8 md:h-10 md:w-10' height={1000} width={1000} src={"/crypt.png"} alt="Logo" /></Link>
      <div className={`relative flex items-center w-[12rem] md:w-[30.5rem] gap-1 pl-1.5 border-[1px] ${isDarkMode ? 'border-gray-600 bg-gray-900' : 'bg-white border-gray-300'} rounded-md`}>
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}><Search/></span>
        <input 
          className={`outline-none rounded-r-md p-1.5 w-full text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'}`}
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {showDropdown && (
          <div className={`absolute text-xs top-full left-0 w-full mt-1 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border rounded-md shadow-lg z-10`}>
            {searchResults.map((coin) => (
              <div 
                key={coin.id}
                className={`p-2 cursor-pointer font-semibold flex items-center ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                onClick={() => handleCoinSelect(coin.id)}
              >
                <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-2" />
                <span>{coin.name} ({coin.symbol})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='cursor-pointer' onClick={handleThemeToggle}>
        {isDarkMode ? <WbSunny /> : <Brightness2 />}
      </div>
    </nav>
  );
};

export default Header;
