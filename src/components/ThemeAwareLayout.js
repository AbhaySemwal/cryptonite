"use client"
import { useSelector } from 'react-redux';
import Header from "@/components/Header";
import WatchList from "@/components/WatchList";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from '@/redux/slices/themeSlice';

export default function ThemeAwareLayout({ children }) {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dm = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch, dm]);

  return (
    <div className={`theme-transition min-h-screen ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="w-full pb-5">
        <Header />
      </div>
      <div className="flex flex-col md:flex-row gap-5 w-full px-3 md:px-5 overflow-hidden">
        <div className="w-full md:w-[65%] animate-slide-in-left">
          {children}
        </div>
        <div className="flex flex-col gap-5 w-full md:max-w-[35%] animate-slide-in-right">
          <RecentlyViewed/>
          <WatchList />
        </div>
      </div>
    </div>
  );
}