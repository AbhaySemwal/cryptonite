"use client"
import React from 'react'
import LineChart from './LineChart';
import TrendingMarket from './TrendingMarket';

const HomeContent = () => {
    return (
        <div className='w-full flex flex-col gap-5'>
            <div className='h-full border-[2px] rounded-lg border-gray-600 bg-gray-950 p-1 md:p-5'>
                <LineChart/>
            </div>
            <TrendingMarket/>
        </div>
    )
}

export default HomeContent