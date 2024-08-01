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
permissions:
  pull-requests: write

jobs:
  coverage:
    - name: LCOV parser
      id: lcov-result
      uses: Richter-Consulting/wd-lcov-reporter@v1
      with:
        # Coverage file path
        lcov-file: './coverage/lcov.info'
        # Optional: Files to exclude from coverage report
        excluded-files: '**/*.g.dart, **/*.freezed.dart, **/.realm.dart'
        # Optional (default: 'true): Report coverage as step summary
        step-summary: 'true'
        # Optional (default: 'false): Reoprt coverage on PR
        # (with update of the comment)
        pr-comment: 'true'
        # Optional: GitHub token to write the PR comment
        # (also requires premission to do so)
        github-token: ${{ secrets.GITHUB_TOKEN }}

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
- `*`: filename globe (e.g. `**/email-*-validation.dart` would match
  `email-domain-validation.dart` but not `emailvalidation.dart`)

#### `step-summary`

Publish the coverage table to step summary (optional - default: `true`)

#### `pr-comment`

Publish the coverage table as PR comment. On new push, the comment is updated
(optional - default: `false`)

##### Example

<!-- markdownlint-disable -->

---

# Coverage Summary

Overall coverage: **22.83 %**

<details><summary>Detailed coverage</summary>

| File                | Line Coverage | Function Coverage | Branch Coverage |
| ------------------- | ------------- | ----------------- | --------------- |
| lib/email.dar       | 100.00%       | 0.00%             | 0.00%           |
| lib/exceptions.dart | 40.00%        | 0.00%             | 0.00%           |

</details>

---

<!-- markdownlint-enable -->

#### `github-token`

GitHub token, required only to comment on PR. This is also required the write
permission on PR (see configuration example). If PR comment is disabled, the
token is not needed.

### Overall coverage result

22.83

### Mardown Table result

| File                | Line Coverage | Function Coverage | Branch Coverage |
| ------------------- | ------------- | ----------------- | --------------- |
| lib/email.dart      | 100.00%       | 0.00%             | 0.00%           |
| lib/exceptions.dart | 40.00%        | 0.00%             | 0.00%           |

## TODO

- [x] Parse lcov file, so it is easier to handle the results
- [x] Provide following outputs
  - Markdown table with code coverage per test file
  - Overall coverage
- [x] Add possibility to "comment" on PR
- [x] Add possibility for run output
- [ ] Add templates
