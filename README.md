# LCOV reporter for GitHub Actions

[![GitHub Super-Linter](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)


A simple action that parse the core data from LCOV file (line, function and block coverage). The out put variables provide basic data to use in PR comments or run output.

## Example for configuration

```yaml
- name: LCOV parser
  id: lcov-result
  uses: Richter-Consulting/wd-lcov-reporter
  with:
    lcov-file: './coverage/lcov.info'
    excluded-files: '**/*.g.dart, **/*.freezed.dart, **/.realm.dart'
```

### Configuration parameters



## TODO

- [x] Parse lcov file, so it is easier to handle the results
- [x] Provide following outputs
  - Markdown table with code coverage per test file
  - Overall coverage
