'use client';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistoricalData } from '../redux/slices/historicalDataSlice';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

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

      const chartData = {
        labels: data[0].prices.map((price) => new Date(price[0])),
        datasets: data.map((coin) => ({
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
          pointRadius: 0,
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
                unit: 'day',
              },
              title: {
                display: true,
                text: 'Date',
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