// components/ThemeInitializer.js
"use client"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/redux/slices/themeSlice';

export default function ThemeInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      dispatch(setTheme(JSON.parse(savedTheme)));
    }
  }, [dispatch]);

  return null;
}