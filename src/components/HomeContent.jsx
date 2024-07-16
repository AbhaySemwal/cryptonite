"use client"
import React from 'react'
import LineChart from './LineChart';

const HomeContent = () => {

    return (
        <div className='w-full px-2 md:px-5'>
            <div className='md:w-[70%] h-full border-[2px] rounded-lg border-gray-600 bg-gray-950 p-1 md:p-5'>
                <LineChart/>
            </div>
        </div>
    )
}

export default HomeContent