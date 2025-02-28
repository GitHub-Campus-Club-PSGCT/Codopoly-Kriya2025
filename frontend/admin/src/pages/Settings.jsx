import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Settings as SettingsIcon, Save, RefreshCw, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:3000',
    maxTeams: 45,
    maxBidAmount: 1000,
    refreshInterval: 5,
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'apiUrl' ? value : parseInt(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      apiUrl: 'http://localhost:5000/api',
      maxTeams: 30,
      maxBidAmount: 1000,
      refreshInterval: 5,
    });
    toast.info('Settings reset to default values');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SettingsIcon size={20} className="mr-2 text-blue-600" />
          System Configuration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                API URL
              </label>
              <input
                type="text"
                id="apiUrl"
                name="apiUrl"
                value={settings.apiUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Teams
              </label>
              <input
                type="number"
                id="maxTeams"
                name="maxTeams"
                value={settings.maxTeams}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="maxBidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Default Maximum Bid Amount
              </label>
              <input
                type="number"
                id="maxBidAmount"
                name="maxBidAmount"
                value={settings.maxBidAmount}
                onChange={handleChange}
                min="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Data Refresh Interval (seconds)
              </label>
              <input
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw size={18} className="inline mr-2" />
              Reset to Default
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="inline mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-yellow-600" />
          Advanced Settings
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              Warning: These settings are for advanced users only. Incorrect configuration may affect system stability.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => toast.warning('This feature is not implemented yet.')}
            >
              Reset Database
            </button>
            <p className="mt-2 text-sm text-gray-500">
              This will reset all auction data. Use with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;