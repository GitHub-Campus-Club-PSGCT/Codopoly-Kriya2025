const { QuestionWithError, QuestionCorrect } = require('../models/question');

const getQuestions = async (req, res) => {
    try{
        const questions = await QuestionWithError.find();
        res.status(200).json({ questions });
    }catch(error){
        res.status(400).json({
            message : "Server error",
            error: error.message
        })
    }
}

const submitQuestions = async (req, res) => {
    try{
        const { title, POC, errorPOC } = req.body;
        console.log(POC);

        const check = await QuestionCorrect.findOne({
            title: title
        })

        if(check){
            return res.status(400).json({
                message: "Question title already exists"
            });
        }

        const correctQuestion = new QuestionCorrect({ title, POC: { "1": POC["0"], "2": POC["1"], "3": POC["2"] } });
        console.log(correctQuestion);
        const errorQuestion = new QuestionWithError({ title, POC: { "1": errorPOC["0"], "2": errorPOC["1"], "3": errorPOC["2"] } });
        try{
            await correctQuestion.save();
        }catch(error){
            return res.status(400).json({
                message: "Failed to save the correct question",
                error: error.message
            })
        }
        try{
            await errorQuestion.save();
        }catch(error){
            return res.status(400).json({
                message: "Failed to save the error question",
                error: error.message
            })
        }

        return res.status(201).json({
            message: "Question added successfully"
        })
    }catch(error){
        return res.status(400).json({
            message: "Server error",
            error: error.message
        })
    }
}

module.exports = {
    getQuestions,
    submitQuestions
}