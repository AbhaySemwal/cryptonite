'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const CoinBarChart = ({ coinData }) => {
  const barChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
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
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [coinData]);

  return <canvas ref={barChartRef} />;
};

export default CoinBarChart;