'use client';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fetchCoinDetails } from '@/redux/slices/coinsSlice';
import { fetchHistoricalData } from '@/redux/slices/historicalDataSlice';
import CoinPriceChart from '@/components/Chart/CoinPriceChart';

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

const CoinPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const coinData = useSelector((state) => state.coins.coinDetails[id]);
  const historicalData = useSelector((state) => state.historicalData.data.find((data) => data.name === id));
  const barChartRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id));
      dispatch(fetchHistoricalData(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (coinData && barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');

      const barChartData = {
        labels: ['24h', '7d', '30d'],
        datasets: [
          {
            label: 'Price Change (%)',
            data: [
              coinData.market_data.price_change_percentage_24h,
              coinData.market_data.price_change_percentage_7d,
              coinData.market_data.price_change_percentage_30d,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const barChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time Period',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price Change (%)',
              },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
        },
      });

      return () => {
        barChart.destroy();
      };
    }
  }, [coinData]);

  if (!coinData || !historicalData) {
    return <div>Loading...</div>;
  }

  // Format historical data for CoinPriceChart
  const formattedHistoricalData = historicalData.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp),
    price: price
  }));

  return (
    <div className="flex flex-col gap-5 mx-auto text-white">
      <div className='p-2 md:p-3 border-2 border-gray-600 bg-gray-950 rounded-lg'>
        <h1 className="text-lg md:text-2xl text-center mb-8 font-semibold">{coinData.name}</h1>
        <CoinPriceChart coinId={id} historicalData={formattedHistoricalData} />
      </div>
      <div className='p-2 md:p-3 border-2 border-gray-600 bg-gray-950 rounded-lg'>
        <h2 className="text-lg md:text-2xl mb-4 text-center font-semibold">Price Change Percentages</h2>
        <canvas ref={barChartRef} />
      </div>
      <div className='flex md:flex-row flex-col gap-5 justify-between'>
        <div className='w-full md:w-[48%] p-2 md:p-3 border-2 border-gray-600 bg-gray-950 rounded-lg text-xs md:text-sm'>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Fundamentals</h2>
          <p className='py-1'><strong>Market Cap:</strong> {coinData.market_data.market_cap.usd}</p>
          <p className='py-1'><strong>Total Supply:</strong> {coinData.market_data.total_supply}</p>
          <p className='py-1'><strong>Max Supply:</strong> {coinData.market_data.max_supply}</p>
        </div>
        <div className="w-full md:w-[48%] p-2 md:p-3 border-2 border-gray-600 bg-gray-950 rounded-lg text-xs md:text-sm">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Coin Information</h2>
          <p className='py-1'><strong>Symbol:</strong> {coinData.symbol}</p>
          <p className='py-1'><strong>Current Price:</strong> {coinData.market_data.current_price.usd}</p>
          <p className='py-1'><strong>Total Volume:</strong> {coinData.market_data.total_volume.usd}</p>
        </div>
      </div>
      <div className='p-2 md:p-3 border-2 border-gray-600 bg-gray-950 rounded-lg mb-5'>
        <h2 className="text-lg md:text-2xl md:text-left text-center font-semibold mb-4">About {coinData.name}</h2>
        <p className='text-xs md:text-sm md:text-left text-center' dangerouslySetInnerHTML={{ __html: coinData.description.en }} />
      </div>
    </div>
  );
};

export default CoinPage;