//Have to connect to model here
const { QuestionWithError, QuestionCorrect } = require('../models/question');

const getAllPOCs = async (req, res) => {
    try{
        const questions = await QuestionCorrect.find();  // Fetch all documents
        res.status(200).json(questions);
    }catch(err){
        res.status(400).json({error: error.message});
    }
} 

const insertCorrectQuestions = async (req, res) => {
    try {
      const questions = req.body;  // This should be an array of questions
      const savedQuestions = await QuestionCorrect.insertMany(questions);  // Bulk insert
      res.status(201).json({ message: 'Questions added successfully!', questions: savedQuestions });
    } catch (err) {
      res.status(400).json({ message: 'Failed to add questions', error: err.message });
    }
  };

const insertErrorQuestions = async (req, res) => {
    try {
      const questions = req.body;  // This should be an array of questions
      const savedQuestions = await QuestionWithError.insertMany(questions);  // Bulk insert
      res.status(201).json({ message: 'Questions added successfully!', questions: savedQuestions });
    } catch (err) {
      res.status(400).json({ message: 'Failed to add questions', error: err.message });
    }
  };


module.exports = {
    getAllPOCs,
    insertCorrectQuestions,
    insertErrorQuestions
}