const { Server } = require('socket.io');
const Admin = require('./models/admin');
const Team = require('./models/team');
const Auction = require('./models/auction');  // Assuming you have this model

let currentBid = {
  amount: 0,
  team: null,
};

let auctionTimer = null;
let auctionTimeLeft = 0;

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',  // Allow all origins for development (restrict in production)
    }
  });

  const emitLeaderboard = async () => {
    try {
      const teams = await Team.find().sort({ gitcoins: -1 }); // Sort by gitcoins in descending order
      const leaderboard = teams.map((team, index) => ({
        ...team.toObject(),
        place: index + 1
      }));
      io.emit('leaderboard', leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);

    try {
      const admin = await Admin.findOne({ username: 'Akash' });
      if (!admin) {
        socket.emit('error', { message: 'Admin record not found.' });
        return;
      }

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

      emitLeaderboard();

      // Admin joins to view logs
      socket.on('adminJoin', () => {
        console.log('Admin connected:', socket.id);
        socket.emit('adminLogs', {
          highBidAmount: admin.highBidAmount,
          highBidHoldingTeamId: admin.highBidHoldingTeamId ? admin.highBidHoldingTeamId._id : null,
          highBidHoldingTeamName: highBidTeamName,
          currentBiddingPOC: admin.currentBiddingPOC,
          auctionTimeLeft
        });
      });

      // Handle POC selling
      socket.on('sellPOC', async () => {
        try {
          console.log('Processing POC sale...');
          const admin = await Admin.findOne({ username: 'Akash' });
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

          // Save auction details
          const newAuction = new Auction({
            round,
            POC,
            bought_by: team_id,
            gitcoins: amount,
            team_name: teamName
          });

          team.gitcoins -= amount;
          team.POC.push(POC);
          if (team.POC.length === round) {
            team.canBuyPOC = false;
          }

          await team.save();
          await newAuction.save();

          // Reset current bid
          currentBid = { amount: 0, team: null };
          admin.highBidAmount = 0;
          admin.highBidHoldingTeamId = null;
          await admin.save();

          console.log(`POC: '${POC}' sold successfully to ${teamName}`);
          io.emit('sellPOCSuccess', { message: `POC: '${POC}' sold successfully` });
          io.emit('currentBid', currentBid);  // Broadcast updated bid
          clearInterval(auctionTimer);
          io.emit('auctionEnded');
          emitLeaderboard();  // Update leaderboard

        } catch (error) {
          console.error('Error in confirming the bid:', error);
          socket.emit('sellPOCFailed', { message: 'Server error.' });
        }
      });

      // Admin starts the auction timer
      socket.on('startAuction', (duration) => {
        if (auctionTimer) {
          clearInterval(auctionTimer);
        }

        auctionTimeLeft = duration;
        io.emit('auctionStarted', auctionTimeLeft,admin.currentBiddingPOC);

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

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }

    // Handle placing bids
    socket.on('placeBid', async ({ teamId, teamName, bidAmount }) => {
      try {
        console.log("Inside place bid");
        const [admin, team] = await Promise.all([
          Admin.findOne({ username: 'Akash' }),
          Team.findById(teamId),
        ]);

        if (!admin) {
          socket.emit('bidFailed', { message: 'Admin record not found.' });
          return;
        }

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
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = socketHandler;
