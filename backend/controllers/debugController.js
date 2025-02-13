const { QuestionWIthError, QuestionCorrect } = require('../models/question');
const { QuestionWithError } = require('../models/question');
const Debug = require('../models/debug');
const Team = require('../models/team');
const { runPythonCode } = require('../utils/pythonRunner');




const getTeamPOC = async (req, res) => {
    try{
        const teamId = req.teamId;

        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({
                message : "Team not found!"
            });
        }

        const assignedPOCs = team.POC  //to get all the POCs of a specific team - like [A1, B2, C3]

        const questions = await QuestionWithError.find({// question schema of A,B,C
            title: { $in: assignedPOCs.map(poc => poc[0]) }
        });

        const teamPOCs = assignedPOCs.map(poc => {
            const question = questions.find(q => q.title === poc[0]); //checking === again to prevent change in order of questions
            return {
                pocName: poc,
                code: question ? question.POC[poc[1]] : null
            }
        })

        res.status(200).json({ teamPOCs }); 
    }catch(error){
        res.status(400).json({
            message : "Server error",
            error: error.message
        });
    }
}

const submitDebugs = async (req, res) => {
    try{
        const {questionTitle, pocTitle, debugs} = req.body;
        const teamId = req.teamId;

        const question = await QuestionCorrect.findOne({
            title: questionTitle
        })
        if(!question){
            return res.status(404).json({
                message: "Question not found"
            });
        }

        let allPOCs = {...question.POC};
        let pocCode = question.POC[pocTitle];
        if(!pocCode){
            return res.status(404).json({
                message: "POC not found"
            });
        }

        let correctDebugs = [];

        for(const debug of debugs){
            const modifiedCode = applyDebug(pocCode, debug.line, debug.newCode);
            allPOCs[pocTitle] = modifiedCode;

            const fullCode = Object.values(allPOCs).join("\n\n");
            
            
            const result = await runPythonCode(fullCode); // In future, would need to also pass test cases here

            if(result.error){
                return res.status(400).json({
                    message: "Debug caused an error!"
                })
            }

            pocCode = modifiedCode;
            correctDebugs.push(debug);
        }

        await Debug.findOneAndUpdate(
            { teamId, questionTitle, pocTitle },
            { $push: { debugs: { $each: correctDebugs }}},
            { upsert: true, new: true } // new:true so that it returns the updated document
        );

        res.status(200).json({
            message: 'Submitted Debugs!'
        });   
    }catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const applyDebug = (code, line, newCode) => {
    const lines = code.split("\n");
    lines[line - 1] = newCode;
    return lines.join("\n");
};
console.log("Debug Controller Loaded", { getTeamPOC, submitDebugs });

module.exports = {
    getTeamPOC,
    submitDebugs,
};