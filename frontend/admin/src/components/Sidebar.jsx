import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gavel, Share2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/authContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Auction Management', path: '/auction', icon: <Gavel size={20} /> },
    { name: 'POC Distribution', path: '/poc-distribution', icon: <Share2 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'LeaderBoard', path: '/leaderboard', icon : <Settings size={20} /> },
    { name: 'Questions', path: '/question', icon : <Settings size={20} /> },
    { name: 'Remove POC', path: '/removepoc', icon : <Settings size={20} /> },
    { name: 'Add Points', path: '/addpoints', icon : <Settings size={20} /> },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-800 to-indigo-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center justify-center space-x-2 px-4">
        <Gavel size={32} />
        <span className="text-2xl font-extrabold">Admin Panel</span>
      </div>
      
      <nav className="mt-10">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-blue-800 font-medium'
                  : 'text-white hover:bg-blue-700'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 mt-8 rounded-lg text-white hover:bg-red-700 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;