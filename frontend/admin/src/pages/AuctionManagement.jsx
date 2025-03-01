import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Gavel, DollarSign, Users, Check } from 'lucide-react';
import { adminAPI } from '../api/API';

const AuctionManagement = () => {
  const [currentPOC, setCurrentPOC] = useState('');
  const [round, setRound] = useState(1);
  const [maxAmount, setMaxAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const handleUpdatePOC = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await adminAPI.updateCurrentAuctionPOC({
        round,
        POC_name: currentPOC,
        max_amount: maxAmount
      });
      
      toast.success(`Updated current POC to ${currentPOC}`);
    } catch (error) {
      console.error('Error updating POC:', error);
      toast.error('Failed to update current POC');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellPOC = async () => {
    setIsSelling(true);
    
    try {
      await adminAPI.sellPOC();
      toast.success(`POC ${currentPOC} sold successfully!`);
      
      // Clear the current POC after selling
      setCurrentPOC('');
      setRound(prev => prev + 1);
    } catch (error) {
      console.error('Error selling POC:', error);
      toast.error('Failed to sell POC');
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Auction Management</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          Round: {round}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gavel size={20} className="mr-2 text-blue-600" />
            Current Auction
          </h2>
          
          {currentPOC ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current POC</p>
                    <p className="text-xl font-bold text-gray-800">{currentPOC}</p>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Round {round}
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Max Bid Amount</p>
                    <p className="text-lg font-semibold text-gray-800">{maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Highest Bid</p>
                    <p className="text-lg font-semibold text-green-600">Waiting...</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSellPOC}
                disabled={isSelling}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isSelling ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Confirm Sale
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active auction</p>
              <p className="text-sm text-gray-400 mt-2">Set up a new POC for auction using the form</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign size={20} className="mr-2 text-green-600" />
            Set Up Next Auction
          </h2>
          
          <form onSubmit={handleUpdatePOC} className="space-y-4">
            <div>
              <label htmlFor="poc" className="block text-sm font-medium text-gray-700 mb-1">
                POC Name
              </label>
              <input
                type="text"
                id="poc"
                value={currentPOC}
                onChange={(e) => setCurrentPOC(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter POC name (e.g., A1)"
                required
              />
            </div>
            
            <div>
              <label htmlFor="round" className="block text-sm font-medium text-gray-700 mb-1">
                Round Number
              </label>
              <input
                type="number"
                id="round"
                value={round}
                onChange={(e) => setRound(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Bid Amount
              </label>
              <input
                type="number"
                id="maxAmount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="100"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Update Current POC'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-purple-600" />
          Recent Auction History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Round
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  POC
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* This would be populated with real data from your API */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">A1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Team Alpha</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">800</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10:15 AM</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">B2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Team Beta</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">650</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10:30 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionManagement;