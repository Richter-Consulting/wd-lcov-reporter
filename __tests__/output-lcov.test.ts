import {
  calculateOverallCoverage,
  renderAsMardownTable
} from '../src/output-lcov'
import { LcovDocumentType } from '../src/types'

describe('output-lcov.ts', () => {
  describe('calculateOverallCoverage', () => {
    it('calcualte overall coverage for no coverage', () => {
      const parsed: LcovDocumentType[] = []

      const coverage = calculateOverallCoverage(parsed)

      expect(coverage).toBe('0')
    })

    it('calcualte overall coverage for zero coverage', () => {
      const parsed: LcovDocumentType[] = [
        {
          lineCoverage: { found: 0, hit: 0 }
        } as LcovDocumentType
      ]

      const coverage = calculateOverallCoverage(parsed)

      expect(coverage).toBe('0')
    })

    it('calcualte overall coverage for one file', () => {
      const parsed: LcovDocumentType[] = [
        {
          lineCoverage: { found: 100, hit: 35 }
        } as LcovDocumentType
      ]

      const coverage = calculateOverallCoverage(parsed)

      expect(coverage).toBe('35.00')
    })

    it('calcualte overall coverage for multiple file', () => {
      const parsed: LcovDocumentType[] = [
        {
          lineCoverage: { found: 100, hit: 35 }
        } as LcovDocumentType,
        {
          lineCoverage: { found: 200, hit: 90 }
        } as LcovDocumentType
      ]

      const coverage = calculateOverallCoverage(parsed)

      expect(coverage).toBe('41.67')
    })
  })

  describe('renderAsMardownTable', () => {
    it('render markdown table for no coverage', () => {
      const parsed: LcovDocumentType[] = []

      const table = renderAsMardownTable(parsed)

      expect(table).toBe(
        '| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | --- | --- | --- |\n'
      )
    })

    it('render markdown table for zero coverage', () => {
      const parsed: LcovDocumentType[] = [
        {
          sourceFile: 'some-source-file.dart',
          testName: '',
          lineCoverage: { found: 0, hit: 0 },
          functionCoverage: { found: 0, hit: 0 },
          branchCoverage: { found: 0, hit: 0 }
        }
      ]

      const table = renderAsMardownTable(parsed)

      expect(table)
        .toBe(`| File | Line Coverage | Function Coverage | Branch Coverage |
| --- | --- | --- | --- |
| some-source-file.dart | 0.00% | 0.00% | 0.00% |`)
    })

    it('render markdown table for single file coverage', () => {
      const parsed: LcovDocumentType[] = [
        {
          sourceFile: 'some-source-file.dart',
          testName: '',
          lineCoverage: { found: 30, hit: 3 },
          functionCoverage: { found: 1, hit: 1 },
          branchCoverage: { found: 10, hit: 1 }
        }
      ]

      const table = renderAsMardownTable(parsed)

      expect(table)
        .toBe(`| File | Line Coverage | Function Coverage | Branch Coverage |
| --- | --- | --- | --- |
| some-source-file.dart | 10.00% | 100.00% | 10.00% |`)
    })

    it('render markdown table for multiple file coverage', () => {
      const parsed: LcovDocumentType[] = [
        {
          sourceFile: 'some-source-file.dart',
          testName: '',
          lineCoverage: { found: 30, hit: 3 },
          functionCoverage: { found: 1, hit: 1 },
          branchCoverage: { found: 10, hit: 1 }
        },
        {
          sourceFile: 'some-other-file.dart',
          testName: '',
          lineCoverage: { found: 100, hit: 99 },
          functionCoverage: { found: 12, hit: 6 },
          branchCoverage: { found: 30, hit: 10 }
        }
      ]

      const table = renderAsMardownTable(parsed)

      expect(table)
        .toBe(`| File | Line Coverage | Function Coverage | Branch Coverage |
| --- | --- | --- | --- |
| some-source-file.dart | 10.00% | 100.00% | 10.00% |
| some-other-file.dart | 99.00% | 50.00% | 33.33% |`)
    })
  })
})
