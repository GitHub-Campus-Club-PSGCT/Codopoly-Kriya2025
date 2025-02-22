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
      // Fetch the current high bid and auction round from the database (username: "Akash")
      const admin = await Admin.findOne({ username: 'Akash' });
      if (admin) {
        const roundIndex = admin.currentAuctionRound - 1;

        let highBidTeamName = null;
        if (admin.highBidHoldingTeamId[roundIndex]) {
          const highBidTeam = await Team.findOne({ _id: admin.highBidHoldingTeamId[roundIndex] });
          highBidTeamName = highBidTeam ? highBidTeam.team_name : null;
        }

        currentBid = {
          amount: admin.highBidAmount[roundIndex] || 0,
          team: highBidTeamName,
        };

        // Send the current high bid to the newly connected client
        socket.emit('currentBid', currentBid);
        console.log(currentBid);
      }
    } catch (error) {
      console.error('Error fetching high bid from database:', error);
    }

    socket.on('placeBid', async ({ teamId,teamName, bidAmount }) => {
      const admin = await Admin.findOne({ username: 'Akash' });
      if (!admin) {
        socket.emit('bidFailed', { message: 'Admin record not found.' });
        return;
      }

      const roundIndex = admin.currentAuctionRound - 1;  // Determine which round to update (0 or 1)

      if (bidAmount > currentBid.amount) {
        currentBid = { amount: bidAmount, team: teamName };
        console.log(`New highest bid for round ${admin.currentAuctionRound}: ${bidAmount} by ${teamName}`);

        try {
          // Update the high bid in the database for the current auction round
          admin.highBidAmount[roundIndex] = bidAmount;
          admin.highBidHoldingTeamId[roundIndex] = teamId;
          await admin.save();
          console.log(`High bid updated for round ${admin.currentAuctionRound} in database.`);
        } catch (error) {
          console.error('Error updating high bid in database:', error);
        }

        // Broadcast the new bid to all connected clients
        io.emit('newBid', { currentAuctionRound: admin.currentAuctionRound, ...currentBid });
      } else {
        socket.emit('bidFailed', { message: 'Your bid is lower than the current highest bid.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
