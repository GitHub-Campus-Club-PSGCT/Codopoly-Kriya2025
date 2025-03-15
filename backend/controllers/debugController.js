const { QuestionWithError, QuestionCorrect } = require('../models/question');
const Debug = require('../models/debug');
const Team = require('../models/team');
const { runPythonCode } = require('../utils/python');
const logger = require('../config/logger');
//// filepath: e:\Repositories\Codopoly\final\Codopoly-Kriya2025\backend\controllers\debugController.js
// ...existing imports...

const getTeamPOC = async (req, res) => {
    try {
        const teamId = req.teamId;
        const team = await Team.findById(teamId);
        if (!team) {
            logger.error("Team not found!");
            return res.status(404).json({ message : "Team not found!" });
        }

        const assignedPOCs = team.POC;
        const questions = await QuestionWithError.find({
            title: { $in: assignedPOCs.map(poc => poc[0].toUpperCase()) }
        });

        const teamPOCs = assignedPOCs.map(poc => {
            const question = questions.find(q => q.title === poc[0].toUpperCase());
            return {
                pocName: poc,
                code: question ? question.POC[poc[1]] : null
            };
        });
        logger.info(`Successfully Fetched ${team.team_name}'s POC`);
        return res.status(200).json({ teamPOCs });
    } catch (error) {
        logger.error("Error in getTeamPOC (debugController) : ", error);
        return res.status(500).json(error);
    }
};

const isRedundantDebug = (originalLine, debugLine) => {
    logger.info(`Original line : ${originalLine}\nDebug line : ${debugLine}`);
    const normalize = (str) => {
        return str
            .replace(/#.*/g, "")  // Remove comments
            .replace(/\s+/g, ""); // Remove all spaces
    };

    const originalWithoutComments = originalLine.replace(/#.*/g, "").trim();
    const debugWithoutComments = debugLine.replace(/#.*/g, "").trim();

    const normalizedOriginal = normalize(originalLine);
    const normalizedDebug = normalize(debugLine);

    if (normalizedOriginal === "" && normalizedDebug === "") return true;
    if (originalWithoutComments === debugWithoutComments) return true;
    return normalizedOriginal === normalizedDebug;
};

const submitDebugs = async (req, res) => {
    try {
        let { questionTitle, pocName, debugs } = req.body;
        questionTitle = questionTitle.toUpperCase();

        const teamId = req.teamId;
        const questionCorrect = await QuestionCorrect.findOne({ title: questionTitle });
        const questionError = await QuestionWithError.findOne({ title: questionTitle });
        if (!questionCorrect) {
            return res.status(404).json({ message: "Question not found" });
        }

        let allPOCs = JSON.parse(JSON.stringify(questionCorrect.POC));
        let pocCode = questionCorrect.POC[pocName];
        let pocCodeError = questionError.POC[pocName];

        if (!pocCode) {
            return res.status(404).json({ message: "POC not found" });
        }

        let existingDebugs = await Debug.findOne({ teamId, questionTitle, pocTitle: pocName });
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
                logger.info(`Redundant debug at line ${debug.line}`);
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
    print(main(*parsed_input))
`;
                logger.info(`Code to run:\n${codeToRun}`);
                const result = await runPythonCode(codeToRun);
                logger.info(`Python result:\n${JSON.stringify(result, null, 2)}`);

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
                logger.info("Appending debug to existing record");
                debugRecord.debugs.push(...correctDebugs);
                await debugRecord.save();
            } else {
                logger.info("Creating a new debug record");
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
                const pointsPerDebug = 20;
                team.gitcoins += correctDebugs.length * pointsPerDebug;
                team.no_of_debugs.push(correctDebugs.length);
                await team.save();
                logger.info("Updated team points & debug count");
            } else {
                logger.error("Team not found!");
            }
        }

        return res.status(200).json({ message: "Submitted Debugs!" });
    } catch (error) {
        logger.error(`Error in submitDebugs (debugController): ${error.message}`);
        return res.status(500).json({
            message: "An error occurred!",
            error: error.message,
        });
    }
};

const applyDebug = (code, line, newCode) => {
    const lines = code.split("\n");
    if (line < 1 || line > lines.length) return code;

    const originalIndent = lines[line - 1].match(/^\s*/)[0];
    lines[line - 1] = originalIndent + newCode;
    return lines.join("\n");
};

const getDebugs = async (req, res) => {
    try {
        const { questionTitle, pocName } = req.query;
        const teamId = req.teamId;

        if (questionTitle===null || pocName===null) {
            return res.status(400).json({
                message: "Missing required parameters: questionTitle or pocName."
            });
        }

        const debugData = await Debug.findOne({ teamId, questionTitle, pocTitle: pocName });
        if (!debugData) {
            return res.status(200).json({ debugs: [] });
        }

        return res.status(200).json({ debugs: debugData.debugs });
    } catch(error) {
        logger.error(`Error in getDebugs (debugController): ${error.message}`);
        return res.status(500).json({
            message: "Server error - unable to fetch debugs",
            error: error.message
        });
    }
};

module.exports = {
    getTeamPOC,
    submitDebugs,
    getDebugs
};
