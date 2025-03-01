import React from 'react';
import { Bell, User } from 'lucide-react';
import {useAuth}  from '../context/authContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-full">
                <User size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-700">{user?.username || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;