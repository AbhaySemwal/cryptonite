"use client"
import React, { useState } from 'react'
import LineChart from './LineChart';
import TrendingMarket from './TrendingMarket';
import PublicCompaniesHoldings from '@/components/PublicCompaniesHoldings';
import { fetchGlobalMarketCap, fetchPublicCompaniesHoldings } from '@/redux/slices/homeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setTheme } from '@/redux/slices/themeSlice';

const HomeContent = () => {

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
    const { publicCompaniesHoldings } = useSelector(state => state.home);
  
    useEffect(() => {
      dispatch(fetchGlobalMarketCap());
      dispatch(fetchPublicCompaniesHoldings());
    }, [dispatch]);

    return (
        <div className='w-full flex flex-col gap-5 md:pb-5'>
            <div className={`theme-transition flex items-center border-[2px] rounded-lg ${isDarkMode?"bg-gray-950 border-gray-600 text-white":"bg-gray-100 border-gray-400 text-black"} p-1 md:p-3`}>
                <LineChart/>
            </div>
            <TrendingMarket/>
            <PublicCompaniesHoldings companies={publicCompaniesHoldings} />
        </div>
    )
}

export default HomeContent