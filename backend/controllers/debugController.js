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
        console.log("Team POCs:", teamPOCs);

        res.status(200).json({ teamPOCs }); 
    }catch(error){
        res.status(400).json({
            message : "Server error",
            error: error.message
        });
    }
}

const isRedundantDebug = (originalLine, debugLine) => {
    console.log('Original line :',originalLine,'\nDebug line :', debugLine);
    const normalize = (str) => {
        return str
            .replace(/#.*/g, "")  // Remove comments
            .replace(/\s+/g, ""); // Remove all spaces
    };

    const originalWithoutComments = originalLine.replace(/#.*/g, "").trim();
    const debugWithoutComments = debugLine.replace(/#.*/g, "").trim();

    const normalizedOriginal = normalize(originalLine);
    const normalizedDebug = normalize(debugLine);

    // If both lines are empty or only contain comments/spaces → Redundant
    if (normalizedOriginal === "" && normalizedDebug === "") return true;

    // If the only difference is the presence/removal of a comment → Redundant
    if (originalWithoutComments === debugWithoutComments) return true;

    return normalizedOriginal === normalizedDebug;
};


const submitDebugs = async (req, res) => {
    try {
        const { questionTitle, pocName, debugs } = req.body;
        const teamId = req.teamId;
        const questionCorrect = await QuestionCorrect.findOne({ title: questionTitle });
        const questionError = await QuestionWithError.findOne({ title: questionTitle });
        if (!questionCorrect) {
            return res.status(404).json({ message: "Question not found" });
        }

        let allPOCs = JSON.parse(JSON.stringify(questionCorrect.POC)); // Deep copy of POC
        let pocCode = questionCorrect.POC[pocName];
        let pocCodeError = questionError.POC[pocName];

        if (!pocCode) {
            return res.status(404).json({ message: "POC not found" });
        }


        let existingDebugs = await Debug.findOne({ teamId, questionTitle, 'pocTitle': pocName });
        let appliedDebugs = existingDebugs ? [...existingDebugs.debugs] : [];

        // Apply existing debugs
        for (const prevDebug of appliedDebugs) {
            pocCode = applyDebug(pocCode, prevDebug.line, prevDebug.newCode);
        }

        let correctDebugs = [];
        const testCases = questionCorrect.testCases;

        for (const debug of debugs) {
            const originalLine = pocCodeError.split("\n")[debug.line - 1];

            if (isRedundantDebug(originalLine, debug.newCode)) {
                console.log('Redundant debug at line', debug.line);
                return res.status(400).json({ message: `Redundant debug at line ${debug.line}` });
            }

            if (appliedDebugs.some(d => d.line == debug.line)) {
                return res.status(400).json({ message: `Debug conflicts with an existing one at line ${debug.line}` });
            }
            const modifiedCode = applyDebug(pocCode, debug.line, debug.newCode);
            allPOCs[pocName] = modifiedCode;

            const mainFunction = allPOCs["1"];
            const otherFunctions = Object.values(allPOCs).slice(1).join("\n\n");

            let allTestsPass = true;

            for (const test of testCases) {
                const { input, expectedOutput } = test;
                const codeToRun = `
${otherFunctions.trim()}

${mainFunction.trim()}

if __name__ == "__main__":
    import json
    parsed_input = json.loads('${input}')
    print(main(parsed_input))
`;
                console.log(codeToRun);
                const result = await runPythonCode(codeToRun);
                console.log(result);
                if (result.error) {
                    return res.status(400).json({
                        message: "Debug caused an error!",
                        errorDetails: result.error,
                    });
                }

                if (result.output.trim() !== expectedOutput.trim()) {
                    return res.status(400).json({
                        message: "Output mismatch!",
                        expected: expectedOutput,
                        received: result.output.trim(),
                    });
                }
            }

            if (allTestsPass) {
                pocCode = modifiedCode;
                correctDebugs.push(debug);
            }
        }

        if (correctDebugs.length > 0) {
            let debugRecord = await Debug.findOne({ teamId, questionTitle, pocTitle: pocName });

            if (debugRecord) {
                console.log("Appending debug to existing record");
                debugRecord.debugs.push(...correctDebugs);
                await debugRecord.save();
            } else {
                console.log("Creating a new debug record");
                debugRecord = new Debug({
                    teamId,
                    questionTitle,
                    pocTitle: pocName,
                    debugs: correctDebugs,
                });
                await debugRecord.save();
            }

            let team = await Team.findById(teamId);
            if (team) {
                const pointsPerDebug = 50; // Adjust this value as needed
        
                team.gitcoins += correctDebugs.length * pointsPerDebug;  // Add points
                team.no_of_debugs.push(correctDebugs.length); // Track number of debugs
        
                await team.save();
                console.log("Updated team points & debug count");
            } else {
                console.log("Team not found!");
            }
        }

        res.status(200).json({ message: "Submitted Debugs!" });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred!",
            error: error.message,
        });
    }
};



const applyDebug = (code, line, newCode) => {
    const lines = code.split("\n");
    if (line < 1 || line > lines.length) return code;

    const originalIndent = lines[line - 1].match(/^\s*/)[0]; // Capture leading spaces
    lines[line - 1] = originalIndent + newCode; // Preserve indentation

    return lines.join("\n");
};

const getDebugs = async (req, res) => {
    try{
        const { questionTitle, pocName } = req.query;
        const teamId = req.teamId;

        if (questionTitle===null || pocName===null) {
            return res.status(400).json({
                message: "Missing required parameters: questionTitle or pocName."
            });
        }

        const debugData = await Debug.findOne({ teamId, questionTitle, 'pocTitle': pocName });
        
        

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