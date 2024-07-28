import type { FoundHitType, LcovDocumentType } from './types'

export function calculateOverallCoverage(
  lcovDocuments: LcovDocumentType[]
): string {
  const overallCoverage: FoundHitType = {
    found: 0,
    hit: 0
  }

  for (const lcovDocument of lcovDocuments) {
    overallCoverage.found += lcovDocument.lineCoverage.found
    overallCoverage.hit += lcovDocument.lineCoverage.hit
  }

  return overallCoverage.found === 0
    ? '0'
    : ((overallCoverage.hit / overallCoverage.found) * 100).toFixed(2)
}

export function renderAsMardownTable(
  lcovDocuments: LcovDocumentType[]
): string {
  const header = '| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | --- | --- | --- |\n'
  const rows = lcovDocuments.map(doc => _renderResultLine(doc)).join('\n')

  return `${header}${rows}`
}

function _renderResultLine(line: LcovDocumentType): string {
  const fileName = line.sourceFile
  const lineCoverage =
    line.lineCoverage.found === 0
      ? 0
      : (line.lineCoverage.hit / line.lineCoverage.found) * 100
  const functionCoverage =
    line.functionCoverage.found === 0
      ? 0
      : (line.functionCoverage.hit / line.functionCoverage.found) * 100
  const branchCoverage =
    line.branchCoverage.found === 0
      ? 0
      : (line.branchCoverage.hit / line.branchCoverage.found) * 100
  return `| ${fileName} | ${lineCoverage.toFixed(2)}% | ${functionCoverage.toFixed(2)}% | ${branchCoverage.toFixed(2)}% |`
}
