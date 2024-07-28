import { parseLcov } from '../src/parse-lcov'
import { LcovParserConfigType } from '../src/types'

describe('parse-lcov.ts', () => {
  it('parse simple flutter lcov file', async () => {
    const conf: LcovParserConfigType = {
      lcovFilePath: './__tests__/lcov-test-1.info'
    }

    const parsed = await parseLcov(conf)

    expect(parsed).toHaveLength(1)
    const first = parsed[0]
    expect(first.sourceFile).toBe('lib/main.dart')
    expect(first.testName).toBe('')
    expect(first.lineCoverage).toEqual({ found: 26, hit: 24 })
  })

  it('parse more complex flutter lcov file', async () => {
    const conf: LcovParserConfigType = {
      lcovFilePath: './__tests__/lcov-test-2.info'
    }

    const parsed = await parseLcov(conf)

    expect(parsed).toHaveLength(22)
    const email = parsed.find(
      f => f.sourceFile === 'lib/domain/models/email.dart'
    )
    expect(email).toBeDefined()
    expect(email?.testName).toBe('')
    expect(email?.lineCoverage).toEqual({ found: 4, hit: 4 })
    const prefs = parsed.find(
      f => f.sourceFile === 'lib/model/personal_preferences.dart'
    )
    expect(prefs).toBeDefined()
    expect(prefs?.lineCoverage).toEqual({ found: 10, hit: 1 })
  })

  it('parser removes excluded files', async () => {
    const conf: LcovParserConfigType = {
      lcovFilePath: './__tests__/lcov-test-2.info',
      excludeFiles: [
        // Generated .g.dart files
        '**/*.g.dart',
        // Generated .freezed.dart files
        '**/*.freezed.dart',
        // Generated realm modesl
        '**/*.realm.dart',
        // A dedicated file
        'lib/core/failures/failures.dart'
      ]
    }

    const parsed = await parseLcov(conf)

    expect(parsed).toHaveLength(17)
    expect(parsed.some(f => f.sourceFile.endsWith('.g.dart'))).toBe(false)
    expect(parsed.some(f => f.sourceFile.endsWith('.freezed.dart'))).toBe(false)
    expect(parsed.some(f => f.sourceFile.endsWith('.realm.dart'))).toBe(false)
    expect(parsed.some(f => f.sourceFile.endsWith('failures.dart'))).toBe(false)
  })
})
