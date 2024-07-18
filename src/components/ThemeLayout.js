// components/ThemeLayout.js
"use client"
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeLayout({ children }) {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'dark' : 'light'
    }`}>
      {children}
    </div>
  );
}