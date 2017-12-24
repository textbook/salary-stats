# Salary Statistics

Analyse and compare salaries by cohort.

[![Build Status][1]][2]
[![Coverage Status][3]][4]
[![Dependencies][5]][6]
[![License][7]][8]
[![Codacy Grade][9]][10]

## Usage

This tool is very simple to use. You can add as many people, in as many
different cohorts, as you like. Each person can be added by entering their
details in the inputs in the table footer and either clicking the Add button
or hitting Enter. The cohort is simply a string identifying the cohort, for
example by job title or year of starting.

You can delete a single person at a time or everyone at once. In the former
case, if the inputs are empty when you choose to delete a person, they are
filled in with that person's details. This makes it harder to accidentally lose
data and means you can easily "edit" someone by deleting them, modifying the
inputs and submitting them again. In the latter case a warning appears asking
for confirmation, as this cannot be undone.

As you add and remove people, the comparison chart is automatically updated.
The box plot shows five values: the central box is the upper and lower
quartiles and the median; and the outer "fences" are set at the quartiles
plus or minus 1.5 times the interquartile range. Any value outside the fences
is considered an outlier and is shown separately.

## Installation

This project is currently not available via NPM, so you will need to [clone the
repository][11]. It uses the [Angular CLI][12], so start off by running:

```bash
npm install -g @angular/cli
cd [repo directory]
npm install
```

From there you can run it for local testing/development with:

```bash
ng serve
```

and visit the site at http://localhost:4200. The following commands are also
available:

 - `ng lint` - run TSLint on the `*.ts` files in `src/`
 - `ng test` - run the Karma unit tests, and re-run every time something
   changes (add `--no-watch` to run only once)
 - `ng e2e` - run the Protractor end-to-end tests

Both sets of tests are configured to run using the Chrome browser headlessly,
so you won't see anything pop up on your screen.

  [1]: https://travis-ci.org/textbook/salary-stats.svg?branch=master
  [2]: https://travis-ci.org/textbook/salary-stats
  [3]: https://coveralls.io/repos/github/textbook/salary-stats/badge.svg?branch=master
  [4]: https://coveralls.io/github/textbook/salary-stats?branch=master
  [5]: https://david-dm.org/textbook/salary-stats/status.svg
  [6]: https://david-dm.org/textbook/salary-stats
  [7]: https://img.shields.io/badge/license-ISC-blue.svg
  [8]: https://github.com/textbook/salary-stats/blob/master/LICENSE
  [9]: https://api.codacy.com/project/badge/Grade/ec6f1694d6c04b0e82645375719422f2
  [10]: https://www.codacy.com/app/j-r-sharpe-github/salary-stats?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=textbook/salary-stats&amp;utm_campaign=Badge_Grade
  [11]: https://help.github.com/articles/cloning-a-repository/
  [12]: https://cli.angular.io/
