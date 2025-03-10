import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Share2, RefreshCw, Download, Search } from 'lucide-react';
import { adminAPI } from '../api/API';

const POCDistribution = () => {
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionData, setDistributionData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

 
  const handleDistributePOC = async () => {
    setIsDistributing(true);
    
    try {
      const response = await adminAPI.distributePOC();
      toast.success('POC distribution completed successfully!');
    } catch (error) {
      console.error('Error distributing POC:', error);
      toast.error('Failed to distribute POC');
    } finally {
      setIsDistributing(false);
    }
  };

  const filteredTeams = distributionData 
    ? Object.entries(distributionData).filter(([teamId]) => 
        teamId.toString().includes(searchTerm)
      )
    : [];

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">POC Distribution</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDistributePOC}
            disabled={isDistributing}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-400"
          >
            {isDistributing ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Distributing...
              </>
            ) : (
              <>
                <Share2 size={18} className="mr-2" />
                Distribute POC
              </>
            )}
          </button>
          
          {distributionData && (
            <button
              onClick={downloadDistribution}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Download
            </button>
          )}
        </div>
      </div>

      {distributionData ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by team ID"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 1
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 2
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 3
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map(([teamId, pocs]) => (
                  <tr key={teamId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Team {teamId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pocs[0] || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pocs[1] || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pocs[2] || '-'}
                    </td>
                  </tr>
                ))}
                
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No teams found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <Share2 size={48} className="mx-auto text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No POC Distribution Yet</h2>
          <p className="text-gray-600 mb-6">
            Click the "Distribute POC" button to generate and view the POC distribution for all teams.
          </p>
          <p className="text-sm text-gray-500">
            This will assign POCs to teams according to the distribution algorithm.
          </p>
        </div>
      )}
    </div>
  );
};

export default POCDistribution;