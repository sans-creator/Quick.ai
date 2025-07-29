import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { SignIn, useUser } from '@clerk/clerk-react';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col items-start h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'>

      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 hover:cursor-pointer'>
        <img
          src={assets.logo}
          className='text-gray-600 dark:text-gray-300 w-32 sm:w-44 cursor-pointer'
          alt=""
          onClick={() => navigate('/')}
        />
        {
          sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className='w-6 h-6 text-gray-600 dark:text-gray-300 sm:hidden'
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className='w-6 h-6 text-gray-600 dark:text-gray-300 sm:hidden'
            />
          )
        }
      </nav>

      <div className='flex flex-1 w-full h-[calc(100vh-14px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB] dark:bg-gray-950 transition-colors duration-300'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white'>
      <SignIn />
    </div>
  );
};

export default Layout;
