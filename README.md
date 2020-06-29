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

## Deployment

If you're using this to look at real salary data, you don't want to be sharing
it. All analysis happens in your local browser, nothing gets sent to any
backend. If you'd prefer to run your own instance, though, you can easily do
so either:

 1. Without downloading the code:

     - Heroku - click the button below:

        [![Deploy][14]][15]

     - Any web server - download the build output from the [latest
        release][16] and serve it

 2. By downloading the code (e.g. clone the repository) you can deploy to:

     - [Cloud Foundry][13] - install the CF CLI and run `cf push`

     - Heroku - install the Heroku CLI and `git push heroku master`, but you
        will need to manually set up the buildpacks on the app:

        ```shell script
        heroku buildpacks:clear
        heroku buildpacks:add heroku/nodejs
        heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
       ```

     - Any web server - [build locally][17] and serve the content of `dist/`

## Development

You will need to [clone the repository][11]. It uses the [Angular CLI][12], so
start off by running:

```bash
npm install -g @angular/cli
cd [repo directory]
npm install  # or npm ci
```

From there you can run it for local testing/development with:

```bash
npm run start
```

and visit the site at http://localhost:4200. The following commands are also
available:

 - `npm run lint` - run TSLint on the `*.ts` files
 - `npm run test` - run the Karma unit tests (use `test:watch` to re-run every time something
    changes)
 - `npm run e2e` - run the Protractor end-to-end tests
 - `npm run build` - create the production build in `dist/`

Both sets of tests are configured to run using the Chrome browser headlessly,
so you won't see anything pop up on your screen.

  [1]: https://travis-ci.com/textbook/salary-stats.svg?branch=main
  [2]: https://travis-ci.com/textbook/salary-stats
  [3]: https://coveralls.io/repos/github/textbook/salary-stats/badge.svg?branch=main
  [4]: https://coveralls.io/github/textbook/salary-stats?branch=main
  [5]: https://david-dm.org/textbook/salary-stats/status.svg
  [6]: https://david-dm.org/textbook/salary-stats
  [7]: https://img.shields.io/badge/license-ISC-blue.svg
  [8]: LICENSE
  [9]: https://api.codacy.com/project/badge/Grade/ec6f1694d6c04b0e82645375719422f2
  [10]: https://www.codacy.com/app/j-r-sharpe-github/salary-stats?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=textbook/salary-stats&amp;utm_campaign=Badge_Grade
  [11]: https://help.github.com/articles/cloning-a-repository/
  [12]: https://cli.angular.io/
  [13]: https://www.cloudfoundry.org/
  [14]: https://www.herokucdn.com/deploy/button.svg
  [15]: https://heroku.com/deploy?template=https%3A%2F%2Fgithub.com%2Ftextbook%2Fsalary-stats%2Ftree%2Fmain
  [16]: https://github.com/textbook/salary-stats/releases/latest
  [17]: #Development
