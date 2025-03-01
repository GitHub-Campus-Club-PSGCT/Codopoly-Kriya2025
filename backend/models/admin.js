const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    teamCount: { type: Number, default: 0 },  // Total count of teams
    highBidAmount: { type: Number, default: 0 },        // High bid amount 
    highBidHoldingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },  // High bid holding team ID
    qn_distribution: { 
      type: Map, 
      of: [String],   // Array of strings for each key (e.g., '0': ['B1', 'Q3', 'N3'])
      default: {} 
    },
    currentBiddingPOC : {type : String},
    eventStatus: { type: String, enum: ['debugging', 'auction', 'closed'], default: 'closed' },
    currentAuctionRound:{type: Number, default: 0},
    maximumBiddingAmount: {type: Number,default : 0},
    isRegistrationOpen : {type:Boolean,default : true},
    createdAt: { type: Date, default: Date.now }
  });
  

module.exports = mongoose.model('Admin', adminSchema);