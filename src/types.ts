export type LcovParserConfigType = {
  lcovFilePath: string
  excludeFiles?: string[]
}

export type FoundHitType = {
  found: number
  hit: number
}

export type LcovDocumentType = {
  testName: string
  sourceFile: string
  lineCoverage: FoundHitType
  functionCoverage: FoundHitType
  branchCoverage: FoundHitType
}
