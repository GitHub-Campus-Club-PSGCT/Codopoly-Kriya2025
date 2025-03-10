import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../api/API';

const AddPoints = () => {
  const [teams, setTeams] = useState([]);
  const [points, setPoints] = useState({});

  // Fetch teams function moved outside useEffect
  const fetchTeams = async () => {
    try {
      const response = await adminAPI.getTeamWithPoints();
      if (Array.isArray(response.data)) {
        setTeams(response.data);
        toast.success('Teams fetched successfully.');
      } else {
        toast.error('Invalid response from server.');
        console.error('Unexpected API response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams.');
    }
  };

  useEffect(() => {
    fetchTeams(); // Fetch teams initially
  }, []);

  const handlePointsChange = (teamId, value) => {
    setPoints((prev) => ({
      ...prev,
      [teamId]: value,
    }));
  };

  const handleSubmit = async () => {
    const teamsToUpdate = Object.keys(points)
      .map((teamId) => ({
        teamId,
        points: parseInt(points[teamId], 10) || 0,
      }))
      .filter((team) => team.points !== 0);

    if (teamsToUpdate.length === 0) {
      toast.error('No points entered for any team.');
      return;
    }

    try {
      const response = await adminAPI.addTeamPoints(teamsToUpdate);
      toast.success(response.message);
      setPoints({}); // Clear input fields after submission
      await fetchTeams(); // Fetch updated team points after submission
    } catch (error) {
      console.error('Error adding points:', error);
      toast.error('Failed to update points.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Add Points to Teams</h2>

      {teams.length === 0 ? (
        <p className="text-gray-600">Loading teams...</p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team._id} className="p-4 border rounded-lg">
              <p className="font-semibold text-lg">{team.team_name || 'Unnamed Team'}</p>
              <p className="text-gray-600">
                Current Points: <span className="font-bold">{team.gitcoins}</span>
              </p>

              <input
                type="number"
                value={points[team._id] || ''}
                onChange={(e) => handlePointsChange(team._id, e.target.value)}
                placeholder="Enter points"
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition"
      >
        Submit Points
      </button>
    </div>
  );
};

export default AddPoints;
