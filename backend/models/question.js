const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    POC: {
      "1": { type: String, required: true },
      "2": { type: String, required: true },
      "3": { type: String, required: true }
    },
    sold: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    bought_by: [{ type: String }]  // Array of team names
  });
  
const QuestionWithError = mongoose.model('QuestionWithError', questionSchema);
const QuestionCorrect = mongoose.model('QuestionCorrect', questionSchema);

module.exports = { QuestionWithError, QuestionCorrect };
  