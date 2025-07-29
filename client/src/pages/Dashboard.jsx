import React, { useEffect, useState } from 'react';
import { dummyCreationData } from '../assets/assets';
import { GemIcon, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import Creationitem from '../components/Creationitem';

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    // Replace with actual API later
    setCreations(dummyCreationData);
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full p-6 overflow-y-scroll bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex items-center justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-slate-600 dark:text-gray-300">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3599F2] to-[#0BB0D7] text-white flex items-center justify-center">
            <Sparkles className="w-5" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-slate-600 dark:text-gray-300">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex items-center justify-center">
            <GemIcon className="w-5" />
          </div>
        </div>
      </div>

      {/* Loading Spinner or Recent Creations */}
      {loading ? (
        <div className="flex h-3/4 items-center justify-center">
          <span className="w-11 h-11 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></span>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4 text-slate-700 dark:text-gray-300 font-medium">Recent Creations</p>
          {creations.map((item) => (
            <Creationitem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
