const express = require('express');
const app = express();
const connectDB = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get('/', (req,res) => {
    res.send('Sample text');
})