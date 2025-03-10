import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RemovePOC = () => {
  const [teams, setTeams] = useState([]);
  const [selectedPOCs, setSelectedPOCs] = useState({});
  const [temp, setTemp] = useState(0);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getTeamsWithPOCs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          toast.error('Invalid response from server.');
          console.error('Unexpected API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast.error('Failed to fetch teams.');
      }
    };

    fetchTeams();
  }, []);

  const handlePOCSelect = (teamId, pocIndex) => {
    setSelectedPOCs((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [pocIndex]: !prev[teamId]?.[pocIndex], // Toggle selection
      },
    }));
  };

  const handleDelete = async () => {
    const selectedData = Object.keys(selectedPOCs).map((teamId) => ({
      teamId,
      pocIndexes: Object.keys(selectedPOCs[teamId] || {})
        .filter((pocIndex) => selectedPOCs[teamId][pocIndex])
        .map(Number),
    })).filter((data) => data.pocIndexes.length > 0);

    if (selectedData.length === 0) {
      toast.error('No POCs selected for deletion.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/admin/deletePOCs', selectedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Selected POCs deleted successfully.');
      setTemp((prev) => (prev+1)%10);
      setSelectedPOCs({});
    } catch (error) {
      console.error('Error deleting POCs:', error);
      toast.error('Failed to delete selected POCs.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-red-600 mb-4">Delete POCs From Teams</h2>
      
      {teams.length === 0 ? (
        <p className="text-gray-600">Loading teams...</p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team._id} className="p-4 border rounded-lg">
              <p className="font-semibold text-lg">{team.team_name || 'Unnamed Team'}</p>

              <div className="ml-6 mt-2 space-y-1">
              {Array.isArray(team.POC) && team.POC.length > 1 ? ( // Ensure there are more than 1 POCs
  team.POC.slice(1).map((poc, index) => ( // Skip first POC (Main Code)
    <label key={index + 1} className="flex items-center">
      <input
        type="checkbox"
        checked={!!selectedPOCs[team._id]?.[index + 1]} // Adjust index to match original array
        onChange={() => handlePOCSelect(team._id, index + 1)} // Adjust index for selection
        className="mr-2"
      />
      {poc}
    </label>
  ))
) : (
  <p className="text-gray-500 italic">No deletable POCs available</p>
)}

              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600 transition"
      >
        Delete Selected POCs
      </button>
    </div>
  );
};

export default RemovePOC;
