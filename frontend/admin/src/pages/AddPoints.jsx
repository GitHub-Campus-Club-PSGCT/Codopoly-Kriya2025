import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddPoints = () => {
  const [teams, setTeams] = useState([]);
  const [points, setPoints] = useState({});
  const [temp, setTemp] = useState(0); // Temporary state for debugging
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/getTeamWithPoints', {
          headers: { Authorization: `Bearer ${token}` },
        });

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

    fetchTeams();
  }, [temp]);

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
        points: parseInt(points[teamId], 10) || 0, // Convert input to number
      }))
      .filter((team) => team.points !== 0); // Only send teams with nonzero points

    if (teamsToUpdate.length === 0) {
      toast.error('No points entered for any team.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/admin/addTeamPoints', teamsToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Points successfully updated.');
      setPoints({}); // Clear input fields after submission
      setTemp((prev) => (prev+1)%10);
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
              <p className="text-gray-600">Current Points: <span className="font-bold">{team.gitcoins}</span></p>

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
