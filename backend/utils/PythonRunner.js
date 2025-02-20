const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const runPythonCode = (code, testCases = []) => {
    return new Promise((resolve) => {
        // Create a temporary Python script file
        const tempFilePath = path.join(__dirname, "temp_script.py");

        // Construct the test cases execution inside Python code
        let testCode = code + "\n\n# Running Test Cases\n";
        testCases.forEach(({ input, expected }, index) => {
            testCode += `
result = ${input}
print("Test ${index + 1}: PASSED" if result == ${JSON.stringify(expected)} else "Test ${index + 1}: FAILED")\n`;
        });

        // Write the script to a temp file
        fs.writeFileSync(tempFilePath, testCode, "utf8");

        // Execute the temporary Python script
        exec(`python "${tempFilePath}"`, { timeout: 3000 }, (error, stdout, stderr) => {
            // Remove the temporary file
            fs.unlinkSync(tempFilePath);

            if (error || stderr) {
                resolve({ error: stderr || error.message });
            } else {
                resolve({ output: stdout.trim() });
            }
        });
    });
};

// Example: Matrix Multiplication
const pythonCode = `
def matrix_multiply(A, B):
    rows_A, cols_A = len(A), len(A[0])
    rows_B, cols_B = len(B), len(B[0])

    if cols_A != rows_B:
        return "Invalid dimensions"

    result = [[sum(A[i][k] * B[k][j] for k in range(cols_A)) for j in range(cols_B)] for i in range(rows_A)]
    return result
`;

const testCases = [
    { input: "matrix_multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]])", expected: [[19, 22], [43, 50]] },
    { input: "matrix_multiply([[2, 0], [0, 2]], [[1, 2], [3, 4]])", expected: [[2, 4], [6, 8]] },
    { input: "matrix_multiply([[1, 2, 3]], [[4], [5], [6]])", expected: [[32]] },
];

//runPythonCode(pythonCode, testCases).then(console.log);

module.exports = { runPythonCode };
