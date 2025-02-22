const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketHandler = require('./socket'); 
const teamRoutes = require('./routes/teamRoutes');
const debugRoutes = require('./routes/debugRoutes');
const bankRoutes = require('./routes/bankRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const questionRoutes = require('./routes/questionRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);  
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins for development (restrict for production)
  }
});

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
connectDB();

// Define routes
app.use('/debug', debugRoutes);
app.use('/bank', bankRoutes);
app.use('/auction', auctionRoutes);
app.use('/team', teamRoutes);
app.use('/question', questionRoutes);

app.get('/', (req, res) => {
  res.send('Sample text');
});

// Use the socket handler
socketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
