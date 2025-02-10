let currentBid = {
    amount: 0,
    team: null,
  };
  
  const socketHandler = (io) => {
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
  
      socket.on('placeBid', ({ teamName, bidAmount }) => {
        if (bidAmount > currentBid.amount) {
          currentBid = { amount: bidAmount, team: teamName };
          console.log(`New highest bid: ${bidAmount} by ${teamName}`);
  
          // Broadcast the new bid to all connected clients
          io.emit('newBid', currentBid);
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
  