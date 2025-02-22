const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const runPythonCode = (code) => {
    console.log("Running Python code...");
    console.log(code);
    return new Promise((resolve) => {
        const tempFilePath = path.join(__dirname, "temp_script.py");

        fs.writeFileSync(tempFilePath, code, "utf8");

        exec(`python "${tempFilePath}"`, { timeout: 3000 }, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            if (error || stderr) {
                resolve({ error: stderr || error.message });
            } else {
                resolve({ output: stdout.trim() });
            }
        });
    });
};

module.exports = { runPythonCode };
