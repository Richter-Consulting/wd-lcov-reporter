import * as core from '@actions/core'
import * as github from '@actions/github'
import { promises as fs, existsSync as exists } from 'fs'
import { LcovParserConfigType } from './types'
import { parseLcov } from './parse-lcov'
import { calculateOverallCoverage, renderAsMardownTable } from './output-lcov'

const _OVERALL_COVERAGE_PLACEHOLDER = '{{overall-coverage}}'
const _COVERAGE_TABLE_PLACEHOLDER = '{{coverage-table}}'
const _defautTemplate = `# Coverage Summary

Overall coverage: **${_OVERALL_COVERAGE_PLACEHOLDER} %**

<details><summary>Detailed coverage</summary>

${_COVERAGE_TABLE_PLACEHOLDER}

</details>
`

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
    const prCommentInput = core.getInput('pr-comment')

    // Check, the file name is set and exists
    if (!lcovFileName) {
      core.setFailed('File name is required')
      return
    }
    if (!exists(lcovFileName)) {
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
      const summary = await _generateSummary(overallCoverage, markdownTable)
      core.summary.addRaw(summary).write()
    }

    // Set PR comment, if requested
    if (prCommentInput === 'true') {
      await _handlePrComment(overallCoverage, markdownTable)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
async function _generateSummary(
  overallCoverage: string,
  markdownTable: string
): Promise<string> {
  core.info('Generating coverage summary...')

  // Template from configuration
  let template = core.getInput('template-string')
  if (!template || template.trim() === '') {
    // Template from file
    const templateFile = core.getInput('template-file')
    if (templateFile && templateFile.trim() !== '' && !exists(templateFile)) {
      core.setFailed(`Template file not found: ${templateFile}`)
      return ''
    }

    if (templateFile) {
      template = await fs.readFile(template, { encoding: 'utf-8' })
    }
  }

  if (!template || template.trim() === '') {
    // Fallback to default template
    template = _defautTemplate
  }

  const summary = template
    .replaceAll(_OVERALL_COVERAGE_PLACEHOLDER, overallCoverage)
    .replaceAll(_COVERAGE_TABLE_PLACEHOLDER, markdownTable)
  return summary
}

async function _handlePrComment(
  overallCoverage: string,
  markdownTable: string
): Promise<void> {
  const prNumber = github.context.payload.pull_request?.number
  if (!prNumber || prNumber <= 0) {
    core.warning('PR number not found. Skipping PR comment.')
    return
  }

  core.info('Commenting on PR...')
  const commentTag = `<!-- Richter-Constulting/wd-lcov-reporter-action for PR: ${prNumber} -->`

  // Search for the comment with the given tag
  const octokit = github.getOctokit(core.getInput('github-token'))
  let commentId = -1
  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    { ...github.context.repo, issue_number: prNumber, per_page: 100 }
  )) {
    const foundComment = comments.find(comment =>
      comment.body?.includes(commentTag)
    )
    if (foundComment) {
      commentId = foundComment.id
      break
    }
  }

  const summary = `${await _generateSummary(overallCoverage, markdownTable)}
${commentTag}`
  // If comment, found, replace the existing comment
  if (commentId > 0) {
    await octokit.rest.issues.updateComment({
      ...github.context.repo,
      comment_id: commentId,
      body: summary
    })
  } else {
    // If not found, create a new comment
    await octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body: summary
    })
  }
}
