'use client';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistoricalData } from '../redux/slices/historicalDataSlice';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

const filterDataForSameDay = (data) => {
  if (data.length === 0 || data[0].prices.length === 0) return data;

  const firstDate = new Date(data[0].prices[0][0]);
  const targetDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());

  return data.map(coin => ({
    ...coin,
    prices: coin.prices.filter(price => {
      const priceDate = new Date(price[0]);
      return priceDate.getDate() === targetDate.getDate() &&
             priceDate.getMonth() === targetDate.getMonth() &&
             priceDate.getFullYear() === targetDate.getFullYear();
    })
  }));
};

const LineChart = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.historicalData);
  const chartRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHistoricalData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
  
      const filteredData = filterDataForSameDay(data);
  
      if (filteredData.length === 0 || filteredData[0].prices.length === 0) {
        console.error('No data available for the chart');
        return;
      }
  
      const chartDate = new Date(filteredData[0].prices[0][0]).toLocaleDateString();
  
      const chartData = {
        labels: filteredData[0].prices.map((price) => new Date(price[0])),
        datasets: filteredData.map((coin) => ({
          label: coin.name,
          data: coin.prices.map((price) => ({ x: new Date(price[0]), y: price[1] })),
          fill: false,
          borderColor:
            coin.name === 'bitcoin'
              ? 'rgba(255, 99, 132, 1)'
              : coin.name === 'ethereum'
              ? 'rgba(54, 162, 235, 1)'
              : 'rgba(75, 192, 192, 1)',
          backgroundColor:
            coin.name === 'bitcoin'
              ? 'rgba(255, 99, 132, 0.2)'
              : coin.name === 'ethereum'
              ? 'rgba(54, 162, 235, 0.2)'
              : 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
        })),
      };
  
      const chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH:mm'
                }
              },
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
              },
              beginAtZero: false,
            },
          },
          plugins: {
            title: {
              display: true,
              text: `Cryptocurrency Prices Today`,
            },
            legend: {
              display: true,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: function(context) {
                  return new Date(context[0].parsed.x).toLocaleString();
                }
              }
            },
          },
        },
      });
  
      return () => {
        chart.destroy();
      };
    }
  }, [data, status]);

  if (status === 'loading') {
    return <div>Loading chart...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading chart.</div>;
  }

  return <canvas ref={chartRef} />;
};

export default LineChart;