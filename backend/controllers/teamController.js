const Team = require('../models/team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerTeam = async (req, res) => {
  const { teamName, password, members } = req.body;

  try {
    const existingTeam = await Team.findOne({ team_name: teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeam = new Team({
      team_name: teamName,
      password: hashedPassword,
      members,
      gitcoins: 0,  // Initial gitcoins for each team
      no_of_debugs: [0, 0],  // Initialize no_of_debugs for both rounds
    });
    await newTeam.save();
    const token = jwt.sign({ teamId: newTeam._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Team registered successfully!' ,token});
  } catch (err) {
    res.status(500).json({ message: 'Registration failed!', error: err.message });
  }
};

const loginTeam = async (req, res) => {
  const { teamName, password } = req.body;

  try {
    const team = await Team.findOne({ team_name: teamName });
    if (!team) {
      return res.status(404).json({ message: 'Team not found!' });
    }

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password!' });
    }
    const token = jwt.sign({ teamId: team._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful!', token });

  } catch (err) {
    res.status(500).json({ message: 'Login failed!', error: err.message });
  }
};

// Get Team Details (Protected Route)
const getTeamDetails = async (req, res) => {
    try {
      const team = await Team.findById(req.teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found!' });
      }
  
      res.status(200).json(team);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get team details!', error: err.message });
    }
  };
module.exports = { registerTeam, loginTeam, getTeamDetails };
