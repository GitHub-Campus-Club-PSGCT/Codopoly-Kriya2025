const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    round: { type: Number },
    POC: { type: String },
    bought_by: { type: String }
});

module.exports = mongoose.model("Auction",auctionSchema);