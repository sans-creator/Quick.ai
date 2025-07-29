import React from 'react';
import { Protect, SignedOut, useClerk, useUser } from '@clerk/clerk-react';
import {
  House,
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/ai',
    label: 'Dashboard',
    Icon: House,
  },
  {
    to: '/ai/write-article',
    label: 'Write Article',
    Icon: SquarePen,
  },
  {
    to: '/ai/blog-titles',
    label: 'Blog Titles',
    Icon: Hash,
  },
  {
    to: '/ai/generate-images',
    label: 'Generate Images',
    Icon: Image,
  },
  {
    to: '/ai/remove-background',
    label: 'Remove Background',
    Icon: Eraser,
  },
  {
    to: '/ai/remove-object',
    label: 'Remove Object',
    Icon: Scissors,
  },
  {
    to: '/ai/review-resume',
    label: 'Review Resume',
    Icon: FileText,
  },
  {
    to: '/ai/community',
    label: 'Community',
    Icon: Users,
  },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 transition-all ease-in-out duration-300 ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      }`}
    >
      <div className="my-7 w-full flex flex-col items-center">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-13 h-13 rounded-full mx-auto object-cover"
        />
        <h1 className="mt-1 text-center text-lg font-semibold text-gray-900 dark:text-white">
          {user.fullName}
        </h1>

        <div className="mt-6 w-full flex flex-col gap-1 px-4">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
            >
              {({ isActive }) => (
                <div
                  className={`px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 dark:border-gray-700 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h1 className="text-sm font-medium text-gray-700 dark:text-white">
              {user.fullName || 'User'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-5 h-5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
