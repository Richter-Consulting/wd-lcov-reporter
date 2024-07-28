import { promises as fs } from 'fs'
import { isMatch } from 'micromatch'
import { LcovDocumentType, LcovParserConfigType } from './types'

export async function parseLcov({
  lcovFilePath,
  excludeFiles = []
}: LcovParserConfigType): Promise<LcovDocumentType[]> {
  const lcovContent = await fs.readFile(lcovFilePath, { encoding: 'utf-8' })
  // Parse the lcovContent into a typescript object
  const parsedObject = _parseLcovContent(lcovContent)
  return excludeFiles.length === 0
    ? parsedObject
    : parsedObject.filter(
        lcovDocument =>
          !isMatch(lcovDocument.sourceFile, excludeFiles, {
            nobrace: true,
            nobracket: true
          })
      )
}

function _parseLcovContent(lcovContent: string): LcovDocumentType[] {
  // Split by line
  const lcovLines = lcovContent.split('\n')
  const lcovDocuments: LcovDocumentType[] = []

  let currentDocument: LcovDocumentType = _createEmptyLcovDocument()

  for (const line of lcovLines) {
    const [token, content] = line.split(':')
    switch (token) {
      case 'SF': {
        // Source file name
        currentDocument.sourceFile = content
        break
      }
      case 'TN': {
        // Test name
        currentDocument.testName = content
        break
      }
      case 'LF': {
        // Found lines
        currentDocument.lineCoverage.found = parseInt(content)
        break
      }
      case 'LH': {
        // Hit lines
        currentDocument.lineCoverage.hit = parseInt(content)
        break
      }
      case 'FNF': {
        // Found functions
        currentDocument.functionCoverage.found = parseInt(content)
        break
      }
      case 'FNH': {
        // Hit functions
        currentDocument.functionCoverage.hit = parseInt(content)
        break
      }
      case 'BRF': {
        // Found branches
        currentDocument.branchCoverage.found = parseInt(content)
        break
      }
      case 'BRH': {
        // Hit branches
        currentDocument.branchCoverage.hit = parseInt(content)
        break
      }
      case 'end_of_record': {
        // End of record
        lcovDocuments.push(currentDocument)
        currentDocument = _createEmptyLcovDocument()
        break
      }
    }
  }

  return lcovDocuments
}

function _createEmptyLcovDocument(): LcovDocumentType {
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
  }
}
