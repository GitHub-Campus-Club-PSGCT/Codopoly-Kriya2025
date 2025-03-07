const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    round: { type: Number },
    POC: { type: String },
    gitcoins : {type:Number},
    bought_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    team_name : {type : String},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Auction",auctionSchema);