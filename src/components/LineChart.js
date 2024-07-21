'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CircularProgress } from '@mui/material';
import { Replay } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

const LineChart = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const { data, status, error } = useSelector((state) => state.historicalData);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [timeRange, setTimeRange] = useState('30d');
  const router=useRouter()

  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    const pastDate = new Date(now.getTime());

    switch (range) {
      case '24h':
        pastDate.setDate(pastDate.getDate() - 1);
        break;
      case '7d':
        pastDate.setDate(pastDate.getDate() - 7);
        break;
      case '30d':
        pastDate.setMonth(pastDate.getMonth() - 1);
        break;
      default:
        pastDate.setMonth(pastDate.getMonth() - 1); // Default to 30d
    }

    return data.map(coin => ({
      ...coin,
      prices: coin.prices.filter(price => new Date(price[0]) >= pastDate)
    }));
  };

  useEffect(() => {
    if (status === 'succeeded' && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      const filteredData = filterDataByTimeRange(data, timeRange);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
      const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: filteredData.map((coin) => ({
            label: coin.name,
            data: coin.prices.map((price) => ({ x: new Date(price[0]), y: price[1] })),
            fill: false,
            borderColor: coin.name === 'bitcoin' ? 'rgb(255, 99, 132)' :
                         coin.name === 'ethereum' ? 'rgb(54, 162, 235)' :
                         'rgb(75, 192, 192)',
            tension: 0.1,
            borderWidth: 1.5,
            pointRadius: 0,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          color: textColor,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === '24h' ? 'hour' : 'day'
              },
              title: {
                display: true,
                text: 'Date',
                color: textColor,
              },
              grid: {
                color: gridColor,
                drawOnChartArea: true,
              },
              ticks: {
                color: textColor,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
                color: textColor,
              },
              beginAtZero: false,
              grid: {
                color: gridColor,
                drawOnChartArea: true,
              },
              ticks: {
                color: textColor,
                callback: function(value, index, values) {
                  if (value >= 1000000) {
                    return (value / 1000000).toFixed(1) + 'M';
                  } else if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'k';
                  } else {
                    return value.toFixed(0);
                  }
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Cryptocurrency Prices - ${timeRange}`,
              color: textColor,
            },
            legend: {
              display: true,
              labels: {
                color: textColor,
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              titleColor: textColor,
              bodyColor: textColor,
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            }
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, status, timeRange, isDarkMode]);
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (status === 'loading') {
    return <div className='text-center text-sm font-semibold w-full'><p className='mb-2'>LOADING CHART...</p><CircularProgress/></div>;
  }

  if (status === 'failed') {
    return <div className='text-center text-sm font-semibold w-full'><p className='mb-2'>Error loading chart, Please try again</p><div className='cursor-pointer' onClick={()=>{window.location.reload()}}><Replay/></div></div>;
  }

  return (
    <div className='w-full'>
      <div className="relative w-full min-h-[400px]">
        <canvas ref={chartRef} />
      </div>
      <div className={`theme-transition ${isDarkMode ? "text-white" : "text-black"} flex flex-col md:flex-row justify-center gap-2 text-xs py-2`}>
        <button onClick={() => handleTimeRangeChange('24h')} className={`theme-transition ${isDarkMode ? timeRange === '24h' ? "bg-gray-600" : "bg-gray-800" : timeRange === '24h' ? "bg-gray-400" : "bg-gray-300"} py-1 px-2 rounded-md`}>24h</button>
        <button onClick={() => handleTimeRangeChange('7d')} className={`theme-transition ${isDarkMode ? timeRange === '7d' ? "bg-gray-600" : "bg-gray-800" : timeRange === '7d' ? "bg-gray-400" : "bg-gray-300"} py-1 px-2 rounded-md`}>7d</button>
        <button onClick={() => handleTimeRangeChange('30d')} className={`theme-transition ${isDarkMode ? timeRange === '30d' ? "bg-gray-600" : "bg-gray-800" : timeRange === '30d' ? "bg-gray-400" : "bg-gray-300"} py-1 px-2 rounded-md`}>30d</button>
      </div>
    </div>
  );
};

export default LineChart;
