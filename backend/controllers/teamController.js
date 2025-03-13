const Team = require('../models/team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger'); // Import logger

const registerTeam = async (req, res) => {
  const { teamName, password, members } = req.body;

  try {
    logger.info(`Registering team: ${teamName}`);

    const existingTeam = await Team.findOne({ team_name: teamName });
    if (existingTeam) {
      logger.info(`Registration failed - Team name "${teamName}" already exists`);
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
    const token = jwt.sign({ teamId: newTeam._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    logger.info(`Team "${teamName}" registered successfully`);
    res.status(201).json({ message: 'Team registered successfully!', token });
  } catch (err) {
    logger.error(`Registration failed for "${teamName}": ${err.message}`);
    res.status(500).json({ message: 'Registration failed!', error: err.message });
  }
};

const loginTeam = async (req, res) => {
  const { teamName, password } = req.body;

  try {
    logger.info(`Login attempt for team: ${teamName}`);

    const team = await Team.findOne({ team_name: teamName });
    if (!team) {
      logger.info(`Login failed - Team "${teamName}" not found`);
      return res.status(404).json({ message: 'Team not found!' });
    }

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      logger.info(`Login failed - Invalid password for team "${teamName}"`);
      return res.status(401).json({ message: 'Invalid password!' });
    }

    const token = jwt.sign({ teamId: team._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    logger.info(`Team "${teamName}" logged in successfully`);
    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    logger.error(`Login failed for "${teamName}": ${err.message}`);
    res.status(500).json({ message: 'Login failed!', error: err.message });
  }
};

// Get Team Details (Protected Route)
const getTeamDetails = async (req, res) => {
  try {
    logger.info(`Fetching team details for ID: ${req.teamId}`);

    const team = await Team.findById(req.teamId);
    if (!team) {
      logger.info(`Team details not found for ID: ${req.teamId}`);
      return res.status(404).json({ message: 'Team not found!' });
    }

    logger.info(`Team details retrieved successfully for ID: ${req.teamId}`);
    res.status(200).json(team);
  } catch (err) {
    logger.error(`Failed to fetch team details for ID: ${req.teamId}: ${err.message}`);
    res.status(500).json({ message: 'Failed to get team details!', error: err.message });
  }
};

// Development Utility: Clear All Team POCs
const clearAllTeamPOCs = async (req, res) => {
  try {
    logger.info('Clearing all POCs for all teams');

    const teams = await Team.find({});
    for (const team of teams) {
      team.POC = [];
      await team.save();
    }

    logger.info('All POCs cleared successfully');
    return res.status(200).json({ message: 'All POCs cleared successfully.' });
  } catch (error) {
    logger.error(`Error clearing POCs: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerTeam, loginTeam, getTeamDetails, clearAllTeamPOCs };
