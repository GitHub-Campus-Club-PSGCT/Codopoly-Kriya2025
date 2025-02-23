const { QuestionWithError, QuestionCorrect } = require('../models/question');
const Debug = require('../models/debug');
const Team = require('../models/team');
const { runPythonCode } = require('../utils/pythonRunner');
const { get } = require('mongoose');

const getTeamPOC = async (req, res) => {
    try{
        const teamId = req.teamId;

        const team = await Team.findById(teamId);
        if(!team){
            console.log("Team not found!");
            return res.status(404).json({
                message : "Team not found!"
            });
        }

        const assignedPOCs = team.POC  //to get all the POCs of a specific team - like [A1, B2, C3]
        console.log("Assigned POCs", assignedPOCs);
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
        const {questionTitle, pocName, debugs} = req.body;
        const teamId = req.teamId;

        console.log(questionTitle, "\n", pocName, "\n", debugs);

        const question = await QuestionCorrect.findOne({
            title: questionTitle
        })
        if(!question){
            return res.status(404).json({
                message: "Question not found"
            });
        }

        let allPOCs = JSON.parse(JSON.stringify(question.POC)); // Deep copy of POC
        let pocCode = question.POC[pocName];

        if(!pocCode){
            return res.status(404).json({
                message: "POC not found"
            });
        }

        const existingDebugs = await Debug.findOne({ teamId, questionTitle, pocName });
        let appliedDebugs = existingDebugs ? [...existingDebugs.debugs] : [];
        for (const prevDebug of appliedDebugs) {
            pocCode = applyDebug(pocCode, prevDebug.line, prevDebug.newCode);
        }
        
        let correctDebugs = [];
        const testCases = question.testCases;

        for(const debug of debugs){
            if (appliedDebugs.some(d => d.line === debug.line)) {
                return res.status(400).json({ message: `Debug conflicts with an existing one at line ${debug.line}` });
            }

            const modifiedCode = applyDebug(pocCode, debug.line, debug.newCode);
            allPOCs[pocName] = modifiedCode;

            const mainFunction = allPOCs[0];
            const otherFunctions = Object.values(allPOCs).slice(1).join("\n\n");

            let allTestsPass = true;
            for (const test of testCases) {
                const { input, expectedOutput } = test;
                const codeToRun = `
${otherFunctions}

${mainFunction}

if __name__ == "__main__":
    import json
    parsed_input = json.loads('${JSON.stringify(input)}')
    print(main(parsed_input))
`;
            
            
                const result = await runPythonCode(fullCode); // In future, would need to also pass test cases here
                console.log("Result", result);

                if(result.error){
                    return res.status(400).json({
                        message: "Debug caused an error!"
                    })
                }

                if (result.output.trim() !== expectedOutput.trim()) {
                    return res.status(400).json({
                        message: `Output mismatch! Expected: ${expectedOutput}, Got: ${result.output.trim()}`
                    });
                }

                if(allTestsPass){
                    pocCode = modifiedCode;
                    correctDebugs.push(debug);
                    appliedDebugs.push(debug);
                }
            }
        }
        
        if (correctDebugs.length > 0){
            await Debug.findOneAndUpdate(
                { teamId, questionTitle, pocName },
                { $push: { debugs: { $each: correctDebugs }}},
                { upsert: true, new: true } // new:true so that it returns the updated document
            );
        }

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

const getDebugs = async (req, res) => {
    try{
        console.log('test Fetching debugs');
        const { questionTitle, pocName } = req.query;
        const teamId = req.teamId;

        if (!questionTitle || !pocName) {
            return res.status(400).json({
                message: "Missing required parameters: questionTitle or pocName."
            });
        }

        const debugData = await Debug.findOne({ teamId, questionTitle, pocName });
        
        console.log('test Fetching debugs');

        if (!debugData) {
            return res.status(200).json({
                debugs: []
            });
        }

        res.status(200).json({
            debugs: debugData.debugs
        })

    }catch(error){
        res.status(500).json({
            message: "Server error - unable to fetch debugs",
            error: error.message
        });
    }
}

module.exports = {
    getTeamPOC,
    submitDebugs,
    getDebugs
};