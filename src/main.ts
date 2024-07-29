import * as core from '@actions/core'
import fs from 'fs'
import { LcovParserConfigType } from './types'
import { parseLcov } from './parse-lcov'
import { calculateOverallCoverage, renderAsMardownTable } from './output-lcov'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get file name from input
    const lcovFileName = core.getInput('lcov-file')
    const excludeFiles = core.getInput('exclude-files')
    const stepSummaryInput = core.getInput('step-summary')

    // Check, the file name is set and exists
    core.debug(`stepSummaryInput: ${stepSummaryInput}`)
    if (!lcovFileName) {
      core.setFailed('File name is required')
      return
    }
    if (!fs.existsSync(lcovFileName)) {
      core.setFailed(`File ${lcovFileName} does not exist`)
      return
    }

    const excludedFilesArray = excludeFiles ? excludeFiles.split(',') : []

    const parserConf: LcovParserConfigType = {
      lcovFilePath: lcovFileName,
      excludeFiles: excludedFilesArray
    }

    const parsedCoverage = await parseLcov(parserConf)
    const overallCoverage = calculateOverallCoverage(parsedCoverage)
    const markdownTable = renderAsMardownTable(parsedCoverage)

    // Set outputs for other workflow steps to use
    core.setOutput('coverage', overallCoverage)
    core.setOutput('markdown-table', markdownTable)

    // Set step summary, if requested
    if (stepSummaryInput === 'true') {
      const summary = `# Coverage Summary

Overall coverage: <strong>${overallCoverage}</strong>

<details><summary>Detailed coverage</summary>

${markdownTable}

</details>
`
      core.summary.addRaw(summary).write()
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
