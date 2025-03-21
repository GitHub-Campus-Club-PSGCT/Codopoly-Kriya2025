const { Server } = require('socket.io');
const express = require("express");
const http = require('http');
const Admin = require('./models/admin');
const Team = require('./models/team');
const Auction = require('./models/auction');
require('dotenv').config();
const connectDB = require('./config/db');
const SOCKET_PORT = process.env.SOCKET_PORT ;
const USERNAME = 'Akash';
const app = express();
let currentBid = {
  amount: 0,
  team: null,
};

let auctionTimer = null;
let auctionTimeLeft = 0;

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

connectDB();
const emitLeaderboard = async () => {
  try {
    const teams = await Team.find().sort({ gitcoins: -1 });
    const leaderboard = teams.map((team, index) => ({
      ...team.toObject(),
      place: index + 1
    }));
    io.emit('leaderboard', leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};

const getAdmin = async () => {
  try {
    const admin = await Admin.findOne({ username: USERNAME });
    if (!admin) {
      throw new Error('Admin record not found.');
    }
    return admin;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
};

const handleUpdatePOC = async (data, socket) => {
  try {
    const { round, POC_name, max_amount } = data;
    console.log("IN Update POC ", round, POC_name, max_amount);

    const admin = await Admin.findOneAndUpdate(
      { username: USERNAME },
      {
        currentBiddingPOC: POC_name,
        currentAuctionRound: round,
        maximumBiddingAmount: max_amount,
        highBidAmount: 0,
        highBidHoldingTeamId: null
      },
      { new: true }
    );

    if (!admin) {
      socket.emit('errorUpdatingPOC', { message: 'Admin not found' });
      return;
    }
    console.log("Emitting updatePOCSuccess event", admin.currentBiddingPOC);
    io.emit('updatePOCSuccess', { message: 'currentBiddingPOC updated successfully', poc: admin.currentBiddingPOC });
  } catch (error) {
    console.error('Error updating currentBiddingPOC:', error);
    socket.emit('errorUpdatingPOC', { message: 'Server error' });
  }
};

const handleSellPOC = async (socket) => {
  try {
    console.log('Processing POC sale...');
    const admin = await getAdmin();
    const round = admin.currentAuctionRound;
    const POC = admin.currentBiddingPOC;
    const team_id = admin.highBidHoldingTeamId;
    const amount = admin.highBidAmount;

    if (!team_id) {
      socket.emit('sellPOCFailed', { message: 'No team found for the current round.' });
      return;
    }

    const team = await Team.findOne({ _id: team_id });
    if (!team) {
      socket.emit('sellPOCFailed', { message: 'Team not found.' });
      return;
    }

    const teamName = team.team_name;
    console.log(round, POC, team_id, teamName);

    if (!round || !POC || !team_id || !teamName || !amount) {
      socket.emit('sellPOCFailed', { message: 'Invalid data. Please check the input values.' });
      return;
    }

    const newAuction = new Auction({
      round,
      POC,
      bought_by: team_id,
      gitcoins: amount,
      team_name: teamName
    });

    team.gitcoins -= amount;
    team.POC.push(POC);
    team.canBuyPOC = false;
    await team.save();
    await newAuction.save();

    currentBid = { amount: 0, team: null };
    admin.highBidAmount = 0;
    admin.highBidHoldingTeamId = null;
    await admin.save();

    console.log(`POC: '${POC}' sold successfully to ${teamName}`);
    io.emit('sellPOCSuccess', { message: `POC  sold successfully` });
    io.emit('currentBid', currentBid);
    clearInterval(auctionTimer);
    io.emit('auctionEnded');
    emitLeaderboard();

  } catch (error) {
    console.error('Error in confirming the bid:', error);
    socket.emit('sellPOCFailed', { message: 'Server error.' });
  }
};

const handlePlaceBid = async ({ teamId, teamName, bidAmount }, socket) => {
  try {
    console.log("Inside place bid", teamId);
    const [admin, team] = await Promise.all([
      getAdmin(),
      Team.findById(teamId),
    ]);

    if (!team) {
      socket.emit('bidFailed', { message: 'Invalid Team ID.' });
      return;
    }

    if (admin.eventStatus !== 'auction') {
      socket.emit('bidFailed', { message: 'Auction is not active.' });
      return;
    }

    const teamBalance = team.gitcoins || 0;

    if (bidAmount > teamBalance) {
      socket.emit('bidFailed', { message: 'Your bid amount exceeds your balance.' });
      return;
    }

    if (bidAmount <= currentBid.amount) {
      socket.emit('bidFailed', { message: 'Your bid amount is lower than the current highest bid.' });
      return;
    }

    currentBid = { amount: bidAmount, team: teamName };
    console.log(`New highest bid: ${bidAmount} by ${teamName}`);

    admin.highBidAmount = bidAmount;
    admin.highBidHoldingTeamId = teamId;
    await admin.save();

    console.log(`High bid updated in database.`);

    io.emit('newBid', { ...currentBid });
    emitLeaderboard();

  } catch (error) {
    console.error('Error processing bid:', error);
    socket.emit('bidFailed', { message: 'An error occurred while placing the bid.' });
  }
};

io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);

  try {
    const admin = await getAdmin();
    await emitLeaderboard();
    if (admin.eventStatus !== 'auction') {
      socket.emit('auctionStatus', { message: 'Auction isn\'t started yet. Please wait.' });
      return;
    }

    let highBidTeamName = null;
    if (admin.highBidHoldingTeamId) {
      const highBidTeam = await Team.findById(admin.highBidHoldingTeamId);
      highBidTeamName = highBidTeam ? highBidTeam.team_name : null;
    }

    currentBid = {
      amount: admin.highBidAmount || 0,
      team: highBidTeamName,
    };

    socket.emit('currentBid', currentBid);
    console.log(currentBid);
    console.log('New client connected:', socket.id);
    socket.on('updatePOC', (data) => handleUpdatePOC(data, socket));
    socket.on('sellPOC', () => handleSellPOC(socket));

    socket.on('adminJoin', () => {
      console.log('Admin connected:', socket.id);
      console.log('Current Auction POC : ', admin.currentBiddingPOC);
      io.emit('adminLogs', {
        highBidAmount: admin.highBidAmount,
        highBidHoldingTeamId: admin.highBidHoldingTeamId ? admin.highBidHoldingTeamId._id : null,
        highBidHoldingTeamName: highBidTeamName,
        currentBiddingPOC: admin.currentBiddingPOC,
        auctionTimeLeft
      });
    });

    socket.on('startAuction', (duration) => {
      if (auctionTimer) {
        clearInterval(auctionTimer);
      }

      auctionTimeLeft = duration;
      io.emit('auctionStarted', { time: auctionTimeLeft });

      auctionTimer = setInterval(() => {
        if (auctionTimeLeft > 0) {
          auctionTimeLeft -= 1;
          io.emit('timerUpdate', auctionTimeLeft);
        } else {
          clearInterval(auctionTimer);
          io.emit('auctionEnded');
        }
      }, 1000);
    });

    socket.on('placeBid', (data) => handlePlaceBid(data, socket));

  } catch (error) {
    console.error('Error fetching admin data:', error);
  }



  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.get("/", (req, res) => {
  res.send("Socket.IO Server is running!");
});

// Start Socket.IO server
server.listen(SOCKET_PORT,"0.0.0.0",() => {
  console.log(`Socket.IO Server is running on port ${SOCKET_PORT}`);
});

module.exports = io;