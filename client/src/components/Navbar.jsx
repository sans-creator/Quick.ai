import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets'; 
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
      <img
  src={assets.logo5}
  alt="logo"
  className="w-28 sm:w-36 md:w-40 lg:w-44 transition-transform duration-200 hover:scale-105 cursor-pointer filter dark:brightness-90"
  onClick={() => navigate('/')}
/>


      <div className="flex items-center gap-4">
        {/* 🌗 Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:scale-105 transition'
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* 🧑 Auth Button */}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'
          >
            Get started <ArrowRight className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
