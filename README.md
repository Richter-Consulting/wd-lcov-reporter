# LCOV reporter for GitHub Actions

[![GitHub Super-Linter](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Richter-Consulting/wd-lcov-reporter-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A simple action that parse the core data from LCOV file (line, function and
block coverage). The out put variables provide basic data to use in PR comments
or run output.

## Example for configuration

```yaml
- name: LCOV parser
  id: lcov-result
  uses: Richter-Consulting/wd-lcov-reporter
  with:
    lcov-file: './coverage/lcov.info'
    excluded-files: '**/*.g.dart, **/*.freezed.dart, **/.realm.dart'

- name: Coverage output
  run: |
    echo "${{ steps.lcov-result.outputs.coverage }}"
    echo "${{ steps.lcov-result.outputs.markdown-table }}"
```

### Configuration parameters

#### `lcov-file`

Path to the lcov file to parse (currently only one file supported).

#### `excluded-files`

Comma separated list of files, that should be excluded from code coverade
report. Common globes can be used here:

- `**`: folder globe (e.g. `**/email.dart` would match `foo/email.dart` but also
  `foo/bar/foo-bar/email.dart`)
- `*`: file name globe (e.g. `**/email-*-validation.dart` would match
  `email-domain-validation.dart` but not `emailvalidation.dart`)

### Overall coverage result

22.83

### Mardown Table result

| File                                | Line Coverage | Function Coverage | Branch Coverage |
| ----------------------------------- | ------------- | ----------------- | --------------- |
| lib/domain/models/email.dart        | 100.00%       | 0.00%             | 0.00%           |
| lib/core/exceptions/exceptions.dart | 40.00%        | 0.00%             | 0.00%           |

## TODO

- [x] Parse lcov file, so it is easier to handle the results
- [x] Provide following outputs
  - Markdown table with code coverage per test file
  - Overall coverage
- [ ] Add possibility to "comment" on PR
- [ ] Add possibility for run output
- [ ] Add templates
