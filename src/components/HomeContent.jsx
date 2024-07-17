"use client"
import React from 'react'
import LineChart from './LineChart';
import TrendingMarket from './TrendingMarket';
import PublicCompaniesHoldings from '@/components/PublicCompaniesHoldings';
import { fetchGlobalMarketCap, fetchPublicCompaniesHoldings } from '@/redux/slices/homeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const HomeContent = () => {

    const dispatch = useDispatch();
    const { publicCompaniesHoldings } = useSelector(state => state.home);
  
    useEffect(() => {
      dispatch(fetchGlobalMarketCap());
      dispatch(fetchPublicCompaniesHoldings());
    }, [dispatch]);

    return (
        <div className='w-full flex flex-col gap-5 pb-5'>
            <div className=' flex items-center border-[2px] rounded-lg border-gray-600 bg-gray-950 p-1 md:p-5'>
                <LineChart/>
            </div>
            <TrendingMarket/>
            <PublicCompaniesHoldings companies={publicCompaniesHoldings} />
        </div>
    )
}

export default HomeContent