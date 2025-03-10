import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Share2, RefreshCw, Download, Search, Save } from 'lucide-react';
import { adminAPI } from '../api/API';

const POCDistribution = () => {
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionData, setDistributionData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  // Fetch initial data
  const fetchDistributionData = async () => {
    try {
      const response = await adminAPI.fetchQnData();
      setDistributionData(response.data.data);
      setTeamNames(response.data.team);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchDistributionData();
  }, []);

  // Handle Distribute POC with confirmation
  const handleDistributePOC = async () => {
    const confirmDistribute = window.confirm('Are you sure you want to distribute POC?');
    if (!confirmDistribute) return;

    setIsDistributing(true);
    try {
      await adminAPI.distributePOC();
      toast.success('POC distribution completed successfully!');
      fetchDistributionData(); // Fetch updated data
    } catch (error) {
      console.error('Error distributing POC:', error);
      toast.error('Failed to distribute POC');
    } finally {
      setIsDistributing(false);
    }
  };

  // Handle Save Distributed POC
  const handleSaveDistributedPOC = async () => {
    try {
      await adminAPI.saveDistributedPOC();
      toast.success('Distributed POC saved successfully!');
      fetchDistributionData(); // Fetch updated data
    } catch (error) {
      console.error('Error saving distributed POC:', error);
      toast.error('Failed to save distributed POC');
    }
  };

  // Filter teams based on search
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

          <button
            onClick={handleSaveDistributedPOC}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save size={18} className="mr-2" />
            Save Distributed POC
          </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 4
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    POC 5
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map(([teamId, pocs]) => (
                  <tr key={teamId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {teamNames[teamId] || 'Unknown'}
                    </td>
                    {pocs.map((poc, index) => (
                      <td
                        key={index}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {poc || '-'}
                      </td>
                    ))}
                  </tr>
                ))}

                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No POC Distribution Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Click the "Distribute POC" button to generate and view the POC
            distribution for all teams.
          </p>
          <p className="text-sm text-gray-500">
            This will assign POCs to teams according to the distribution
            algorithm.
          </p>
        </div>
      )}
    </div>
  );
};

export default POCDistribution;
