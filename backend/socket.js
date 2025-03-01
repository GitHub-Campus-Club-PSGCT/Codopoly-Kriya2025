const Admin = require('./models/admin');
const Team = require('./models/team');

let currentBid = {
  amount: 0,
  team: null,
};

const socketHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);

    try {
      // Fetch the admin record only once
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
        const highBidTeam = await Team.findOne({ _id: admin.highBidHoldingTeamId});
        highBidTeamName = highBidTeam ? highBidTeam.team_name : null;
      }

      currentBid = {
        amount: admin.highBidAmount || 0,
        team: highBidTeamName,
      };

      socket.emit('currentBid', currentBid);
      console.log(currentBid);
      socket.on('adminJoin', () => {
        console.log('Admin connected:', socket.id);
        socket.emit('adminLogs', {
          highBidAmount: admin.highBidAmount,
          highBidHoldingTeamId: admin.highBidHoldingTeamId ? admin.highBidHoldingTeamId._id : null,
          highBidHoldingTeamName: highBidTeamName,
          currentBiddingPOC: admin.currentBiddingPOC,
        });
      });
    } catch (error) {
      console.error('Error fetching high bid from database:', error);
    }

    socket.on('placeBid', async ({ teamId, teamName, bidAmount }) => {
      try {
        // Fetch admin and team in parallel
        console.log("Inside place bid");
        const [admin, team] = await Promise.all([
          Admin.findOne({ username: 'Akash' }),
          Team.findOne({ _id: teamId }),
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

        // Update the current highest bid
        currentBid = { amount: bidAmount, team: teamName };
        console.log(`New highest bid for round ${admin.currentAuctionRound}: ${bidAmount} by ${teamName}`);

        // Update the database
        admin.highBidAmount = bidAmount;
        admin.highBidHoldingTeamId = teamId;
        await admin.save();

        console.log(`High bid updated for round ${admin.currentAuctionRound} in database.`);

        // Broadcast the new bid to all clients
        io.emit('newBid', { currentAuctionRound: admin.currentAuctionRound, ...currentBid });

      } catch (error) {
        console.error('Error processing bid:', error);
        socket.emit('bidFailed', { message: 'An error occurred while placing the bid.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
