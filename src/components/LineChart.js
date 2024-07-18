'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistoricalData } from '../redux/slices/historicalDataSlice';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

const LineChart = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.historicalData);
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHistoricalData());
    }
  }, [status, dispatch]);

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

      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(ctx, {
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
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === '24h' ? 'hour' : 'day'
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)'
              },
              beginAtZero: false
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Cryptocurrency Prices - ${timeRange}`
            },
            legend: {
              display: true
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }
      });

      setChartInstance(newChartInstance);
    }
  }, [data, status, timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (status === 'loading') {
    return <div>Loading chart...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading chart: {error}</div>;
  }

  return (
    <div className='w-full'>
      <canvas ref={chartRef} />
      <div className="text-white flex justify-center gap-2 text-xs py-2">
        <button onClick={() => handleTimeRangeChange('24h')} className="bg-gray-800 py-1 px-2 rounded-md">24h</button>
        <button onClick={() => handleTimeRangeChange('7d')} className="bg-gray-800 py-1 px-2 rounded-md">7d</button>
        <button onClick={() => handleTimeRangeChange('30d')} className="bg-gray-800 py-1 px-2 rounded-md">30d</button>
      </div>
    </div>
  );
};

export default LineChart;