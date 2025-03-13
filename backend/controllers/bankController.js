//Have to connect to model here
const { QuestionWithError, QuestionCorrect } = require('../models/question');
const logger = require('../config/logger');

const getAllPOCs = async (req, res) => {
    try {
        const questions = await QuestionCorrect.find();  // Fetch all documents
        logger.info('Fetched all POCs successfully');
        res.status(200).json(questions);
    } catch (err) {
        logger.error(`Error fetching POCs: ${err.message}`);
        res.status(400).json({ error: err.message });
    }
};

const insertCorrectQuestions = async (req, res) => {
    try {
        const questions = req.body;  // This should be an array of questions
        const savedQuestions = await QuestionCorrect.insertMany(questions);  // Bulk insert
        logger.info('Correct questions added successfully');
        res.status(201).json({ message: 'Questions added successfully!', questions: savedQuestions });
    } catch (err) {
        logger.error(`Failed to add correct questions: ${err.message}`);
        res.status(400).json({ message: 'Failed to add questions', error: err.message });
    }
};

const insertErrorQuestions = async (req, res) => {
    try {
        const questions = req.body;  // This should be an array of questions
        const savedQuestions = await QuestionWithError.insertMany(questions);  // Bulk insert
        logger.info('Error questions added successfully');
        res.status(201).json({ message: 'Questions added successfully!', questions: savedQuestions });
    } catch (err) {
        logger.error(`Failed to add error questions: ${err.message}`);
        res.status(400).json({ message: 'Failed to add questions', error: err.message });
    }
};


module.exports = {
    getAllPOCs,
    insertCorrectQuestions,
    insertErrorQuestions
}