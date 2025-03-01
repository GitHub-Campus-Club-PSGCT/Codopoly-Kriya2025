const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    round: { type: Number },
    POC: { type: String },
    bought_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Auction",auctionSchema);