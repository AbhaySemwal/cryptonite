'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const CoinBarChart = ({isDarkMode, coinData }) => {
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
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)',
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

      const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          color: textColor, // Set default text color
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time Period',
                color: textColor,
              },
              grid: {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                drawOnChartArea: true,
              },
              ticks: {
                color: textColor,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price Change (%)',
                color: textColor,
              },
              beginAtZero: true,
              grid: {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                drawOnChartArea: true,
              },
              ticks: {
                color: textColor,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
            title: {
              display: true,
              text: 'Price Change Percentage',
              color: textColor,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              titleColor: textColor,
              bodyColor: textColor,
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
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
  }, [coinData, isDarkMode]);

  return <div className="relative w-full min-h-[400px]"> {/* Ensure container height for responsiveness */}
        <canvas ref={barChartRef} />
      </div>;
};

export default CoinBarChart;