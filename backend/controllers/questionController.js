const { QuestionWithError, QuestionCorrect } = require('../models/question');
const { runPythonCode } = require('../utils/python');
const logger = require('../config/logger');
const Team = require('../models/team');
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

const getPOC = async (req, res) => {
    try {
        const pocName = req.params.pocName; // Assuming the parameter is named pocName
        const title = pocName.charAt(0);
        const pocIndex = pocName.charAt(1);
        console.log(title,pocIndex);
        const question = await QuestionCorrect.findOne({ title });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const poc = question.POC[pocIndex];

        if (!poc) {
            return res.status(404).json({ message: 'POC not found' });
        }

        res.status(200).json({ poc });
    } catch (error) {
        res.status(400).json({
            message: "Server error",
            error: error.message
        });
    }
};
const submitQuestions = async (req, res) => {
    try {
        const { title, POC, errorPOC, testCases } = req.body;
        console.log(testCases);

        const check = await QuestionCorrect.findOne({ title: title });

        if (check) {
            return res.status(400).json({
                message: "Question title already exists"
            });
        }

        let processedTestCases = [];

        try {
            for (const testCase of testCases) {
                const jsonInput = testCase.input;
                console.log('input : ', jsonInput);

                const mainFunction = POC["0"];
                const otherFunctions = Object.values(POC).slice(1).join("\n\n");
                const codeToRun = `
${otherFunctions}

${mainFunction}

if __name__ == "__main__":
    import json
    parsed_input = json.loads('${jsonInput}')
    print(main(*parsed_input))
`;

                const result = await runPythonCode(codeToRun);
                console.log(result);

                if (result.error) {
                    return res.status(400).json({ message: "Error running correct code", error: result.error });
                }

                const normalizeLineEndings = (str) => str.replace(/\r\n/g, "\n");

                processedTestCases.push({
                    input: testCase.input,
                    expectedOutput: normalizeLineEndings(result.output || "None")
                });
            }
        } catch (error) {
            return res.status(400).json({ message: "Error processing test cases", error: error.message });
        }

        const correctQuestion = new QuestionCorrect({
            title,
            POC: { "1": POC["0"], "2": POC["1"], "3": POC["2"] },
            testCases: processedTestCases
        });
        console.log(correctQuestion);

        const errorQuestion = new QuestionWithError({
            title,
            POC: { "1": errorPOC["0"], "2": errorPOC["1"], "3": errorPOC["2"] },
            testCases: processedTestCases
        });

        try {
            await correctQuestion.save();
        } catch (error) {
            return res.status(400).json({
                message: "Failed to save the correct question",
                error: error.message
            });
        }
        try {
            await errorQuestion.save();
        } catch (error) {
            return res.status(400).json({
                message: "Failed to save the error question",
                error: error.message
            });
        }

        return res.status(201).json({
            message: "Question added successfully"
        });
    } catch (error) {
        return res.status(400).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getTeamPOCduringAuction = async(req,res)=>{
    try {
        const teamId = req.teamId;
        const team = await Team.findById(teamId);
        if (!team) {
            logger.error("Team not found!");
            return res.status(404).json({ message : "Team not found!" });
        }

        const assignedPOCs = team.POC;
        const questions = await QuestionWithError.find({
            title: { $in: assignedPOCs.map(poc => poc[0]) }
        });

        const teamPOCs = assignedPOCs.map(poc => {
            const question = questions.find(q => q.title === poc[0]);
            return {
                pocName: poc,
                code: question ? question.POC[poc[1]] : null
            };
        });
        logger.info(`Successfully Fetched ${team.team_name}'s POC`);
        return res.status(200).json({ teamPOCs });
    } catch (error) {
        logger.error("Error in getTeamPOC (debugController) : ", error);
        console.log(error);
        return res.status(500).json(error);
    }
}

module.exports = {
    getQuestions,
    getPOC,
    submitQuestions,
    getTeamPOCduringAuction
}