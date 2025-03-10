const express = require('express');
const connectDB = require('./config/db');
const teamRoutes = require('./routes/teamRoutes');
const debugRoutes = require('./routes/debugRoutes');
const bankRoutes = require('./routes/bankRoutes');
const adminRoutes = require('./routes/adminRoutes')
const questionRoutes = require('./routes/questionRoutes');
const checkEventStatus = require('./middlewares/checkEventStatus');
const cors = require('cors');
require('dotenv').config();

const app = express();

const HTTP_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

// Define routes
//app.use(checkEventStatus);
app.use('/debug', debugRoutes);
app.use('/bank', bankRoutes);
app.use('/team', teamRoutes);
app.use('/admin', adminRoutes);
app.use('/question', questionRoutes);

app.get('/', (req, res) => {
  res.send('Codopoly API Server');
});

// Start the HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running at http://localhost:${HTTP_PORT}`);
});