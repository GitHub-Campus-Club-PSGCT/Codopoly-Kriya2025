const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  team_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  members: [
    {
      kriya_id: { type: String, required: true }
    }
  ],
  gitcoins: { type: Number, default: 0 },
  no_of_debugs: [{ type: Number }],  // Array for two rounds
  POC: [{ type: String }],           // Array of POC names
  no_of_submissions: { type: Number, default: 0 },
  poc_round_1: { type: String },
  gitcoins_round_1: { type: Number, default: 0 },
  poc_round_2: { type: String },
  gitcoins_round_2: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', teamSchema);
