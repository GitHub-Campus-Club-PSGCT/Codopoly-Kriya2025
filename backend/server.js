const express = require('express');
const app = express();
const connectDB = require('./config/db');

const debugRoutes = require('./routes/debugRoutes');
const bankRoutes = require('./routes/bankRoutes');
const auctionRoutes = require('./routes/auctionRoutes');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use('/debug', debugRoutes);
app.use('/bank', bankRoutes);
app.use('/auction', auctionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get('/', (req,res) => {
    res.send('Sample text');
})