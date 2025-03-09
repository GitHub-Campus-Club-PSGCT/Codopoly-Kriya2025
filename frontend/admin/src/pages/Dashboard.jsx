import React, { useState, useEffect } from 'react';
import { Users, Gavel, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminAPI } from '../api/API';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [teamCount, setTeamCount] = useState(0);
  const [eventStatus, setEventStatus] = useState('closed');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const teamCountResponse = await adminAPI.getTeamCount();
        setTeamCount(teamCountResponse.data.teamCount);

        const eventStatusResponse = await adminAPI.getEventStatus();
        setEventStatus(eventStatusResponse.data.eventStatus);
        
        // In a real app, you would fetch the event status and registration status here
        // For now, we'll use placeholder data
        //setEventStatus('closed');
        setIsRegistrationOpen(true);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleChangeEventStatus = async (newStatus) => {
    try {
      await adminAPI.changeEventStatus(newStatus);
      setEventStatus(newStatus);
      toast.success(`Event status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error changing event status:', error);
      toast.error('Failed to change event status');
    }
  };

  const handleToggleRegistration = async () => {
    try {
      await adminAPI.toggleRegistration();
      setIsRegistrationOpen(!isRegistrationOpen);
      toast.success(`Registration is now ${!isRegistrationOpen ? 'open' : 'closed'}`);
    } catch (error) {
      console.error('Error toggling registration:', error);
      toast.error('Failed to toggle registration status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">Event Status:</span>
          <StatusBadge status={eventStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Teams" 
          value={teamCount} 
          icon={<Users size={24} className="text-white" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Current Status" 
          value={eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)} 
          icon={<Gavel size={24} className="text-white" />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Registration" 
          value={isRegistrationOpen ? "Open" : "Closed"} 
          icon={<Clock size={24} className="text-white" />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="System Status" 
          value="Operational" 
          icon={<AlertTriangle size={24} className="text-white" />} 
          color="bg-yellow-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Control</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Change Event Status</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleChangeEventStatus('debugging')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    eventStatus === 'debugging' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Debugging
                </button>
                <button 
                  onClick={() => handleChangeEventStatus('auction')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    eventStatus === 'auction' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Auction
                </button>
                <button 
                  onClick={() => handleChangeEventStatus('closed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    eventStatus === 'closed' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Registration Control</p>
              <button 
                onClick={handleToggleRegistration}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isRegistrationOpen 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isRegistrationOpen ? 'Close Registration' : 'Open Registration'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/auction'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Auction Management
            </button>
            <button 
              onClick={() => window.location.href = '/poc-distribution'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Manage POC Distribution
            </button>
            <button 
              onClick={() => window.location.href = '/settings'}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;