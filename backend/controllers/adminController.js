const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');  
const Team = require('../models/team');
const Auction = require('../models/auction')
const logic = require('./qn_distribution_logic');
//Not in use
const registerAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new Admin({ username, password: hashedPassword });
      await newAdmin.save();
  
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  };

const loginAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };

  const TeamCount = async (req, res) => {
    try {
      // Step 1: Count the total number of teams
      const totalTeams = await Team.countDocuments();
  
      // Step 2: Update the teamCount field in the Admin collection
      const admin = await Admin.findOneAndUpdate(
        { username: req.user.username },  // Assuming req.user is set by the auth middleware
        { teamCount: totalTeams },
        { new: true }
      );
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      res.status(200).json({ message: 'Team count updated successfully', teamCount: admin.teamCount });
    } catch (error) {
      console.error('Error updating team count:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const StartAuction = async (req, res) => {
    try {
      const {round}=req.body;
  
      // Step 2: Update the teamCount field in the Admin collection
      const admin = await Admin.findOneAndUpdate(
        { username: req.user.username },  // filter
        { 
          currentAuctionRound: round,
          [`highBidAmount.${round - 1}`]: 0,
          [`highBidHoldingTeamId.${round - 1}`]: null
        },
        { new: true }
      );
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      res.status(200).json({ message: 'Round updated successfully', Round: admin.currentAuctionRound });
    } catch (error) {
      console.error('Error updating round:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const ChangeEventStatus = async (req, res) => {
    const { newStatus } = req.body;
  
    if (!['debugging', 'auction', 'closed'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid event status.' });
    }
  
    try {
      const admin = await Admin.findOne({ username: 'Akash' });
      if (!admin) return res.status(404).json({ message: 'Admin record not found.' });
  
      admin.eventStatus = newStatus;
      await admin.save();
  
      return res.status(200).json({ message: `Event status changed to ${newStatus}.` });
    } catch (error) {
      console.error('Error updating event status:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

const sellPOC = async(req,res) =>{
    try{ 
      const {round,POC,team_name } = req.body;
      const newAuction = new Auction({round,POC,team_name});
      await newAuction.save();
      return res.status(200).json({message : `POC : '${POC}' sold to ${team_name} successfully`});
    }catch(error){
      console.error('Error in confirming the bid :',error);
      res.status(500).json({message:'Server error. '});
    }
}

const updateCurrentAuctionPOC = async (req, res) => {
  try {
      const { round, POC_name } = req.body;
      const admin = await Admin.findOneAndUpdate(
          { username: req.user.username },
          { currentBiddingPOC: POC_name,
            currentAuctionRound: round,
          [`highBidAmount.${round - 1}`]: 0,
          [`highBidHoldingTeamId.${round - 1}`]: null
           },
          { new: true }
      );
      
      if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
      }
      
      return res.status(200).json({ message: 'currentBiddingPOC updated successfully', admin });
  } catch (error) {
      console.error('Error updating currentBiddingPOC:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {loginAdmin,registerAdmin,TeamCount,StartAuction,ChangeEventStatus,sellPOC,updateCurrentAuctionPOC}