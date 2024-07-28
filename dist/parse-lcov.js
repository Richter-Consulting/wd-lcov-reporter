"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLcov = parseLcov;
const fs_1 = require("fs");
async function parseLcov(filePath) {
    const lcovContent = await fs_1.promises.readFile(filePath, { encoding: 'utf-8' });
    // Parse the lcovContent into a typescript object
    const parsedObject = _parseLcovContent(lcovContent);
    return parsedObject;
}
function _parseLcovContent(lcovContent) {
    // Split by line
    const lcovLines = lcovContent.split('\n');
    const lcovDocuments = [];
    let currentDocument = _createEmptyLcovDocument();
    for (const line of lcovLines) {
        const [token, content] = line.split(':');
        switch (token) {
            case 'SF': {
                // Source file name
                currentDocument.sourceFile = content;
                break;
            }
            case 'TN': {
                // Test name
                currentDocument.testName = content;
                break;
            }
            case 'LF': {
                // Found lines
                currentDocument.lineCoverage.found = parseInt(content);
                break;
            }
            case 'LH': {
                // Hit lines
                currentDocument.lineCoverage.hit = parseInt(content);
                break;
            }
            case 'FNF': {
                // Found functions
                currentDocument.functionCoverage.found = parseInt(content);
                break;
            }
            case 'FNH': {
                // Hit functions
                currentDocument.functionCoverage.hit = parseInt(content);
                break;
            }
            case 'BRF': {
                // Found branches
                currentDocument.branchCoverage.found = parseInt(content);
                break;
            }
            case 'BRH': {
                // Hit branches
                currentDocument.branchCoverage.hit = parseInt(content);
                break;
            }
            case 'end_of_record': {
                // End of record
                lcovDocuments.push(currentDocument);
                currentDocument = _createEmptyLcovDocument();
                break;
            }
        }
    }
    return lcovDocuments;
}
function _createEmptyLcovDocument() {
    return {
        testName: '',
        sourceFile: '',
        lineCoverage: {
            found: 0,
            hit: 0
        },
        functionCoverage: {
            found: 0,
            hit: 0
        },
        branchCoverage: {
            found: 0,
            hit: 0
        }
    };
}
//# sourceMappingURL=parse-lcov.js.map