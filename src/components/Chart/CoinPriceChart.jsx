import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const CoinPriceChart = ({ coinId, historicalData }) => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('24h');
  const chartInstance = useRef(null);

  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    const pastDate = new Date();
    switch (range) {
      case '24h':
        pastDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        pastDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        pastDate.setMonth(now.getMonth() - 1);
        break;
      default:
        pastDate.setDate(now.getDate() - 1);
    }
    return data.filter(d => new Date(d.date) >= pastDate);
  };

  useEffect(() => {
    if (chartRef.current && historicalData) {
      const filteredData = filterDataByTimeRange(historicalData, timeRange);
      
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredData.map(d => d.date),
          datasets: [{
            label: 'Price',
            data: filteredData.map(d => d.price),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
          }]
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
              beginAtZero: false,
              title: {
                display: true,
                text: 'Price (USD)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `${coinId.toUpperCase()} Price - ${timeRange}`
            }
          }
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [historicalData, timeRange, coinId]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className='w-full'>
      <canvas ref={chartRef} />
      <div className="text-white py-2 flex gap-2 justify-center">
        <button onClick={() => handleTimeRangeChange('24h')} className="px-2 py-1 rounded-md text-xs bg-gray-800">24h</button>
        <button onClick={() => handleTimeRangeChange('7d')} className="px-2 py-1 rounded-md text-xs bg-gray-800">7d</button>
        <button onClick={() => handleTimeRangeChange('30d')} className="px-2 py-1 rounded-md text-xs bg-gray-800">30d</button>
      </div>
    </div>
  );
};

export default CoinPriceChart;