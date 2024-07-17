import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const CoinPriceChart = ({ coinId, historicalData }) => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    if (chartRef.current && historicalData) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: historicalData.map(d => d.date),
          datasets: [{
            label: 'Price',
            data: historicalData.map(d => d.price),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  }, [historicalData, timeRange]);

  return (
    <div>
      <div className="mb-4 text-white">
        <button onClick={() => setTimeRange('24h')} className="mr-2">24h</button>
        <button onClick={() => setTimeRange('7d')} className="mr-2">7d</button>
        <button onClick={() => setTimeRange('30d')} className="mr-2">30d</button>
        <button onClick={() => setTimeRange('1y')}>1y</button>
      </div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default CoinPriceChart;