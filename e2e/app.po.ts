import { browser, element, by } from 'protractor';

export class SalaryStatsPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('sst-root h1')).getText();
  }

  getPeople() {
    return element.all(by.css('tbody > tr'));
  }

  getNames() {
    return this._getTextFromAllElements('tbody > tr > td.name');
  }

  getHeaders() {
    return this._getTextFromAllElements('thead > tr:first-of-type > th');
  }

  getFirstRow() {
    return this._getTextFromAllElements('tbody > tr:first-of-type > td');
  }

  getLastRow() {
    return this._getTextFromAllElements('tbody > tr:last-of-type > td');
  }

  addNewRow(name: string, salary: number, cohort: string) {
    element(by.css('tfoot > tr > td.name > input')).sendKeys(name);
    element(by.css('tfoot > tr > td.salary > input')).sendKeys(salary.toString());
    element(by.css('tfoot > tr > td.cohort > input')).sendKeys(cohort);

    return element(by.css('button.is-success')).click();
  }

  deleteFirstRow() {
    return element.all(by.css('tbody button.is-danger')).first().click();
  }

  deleteAllRows() {
    browser.executeScript('window.confirm = function() { return true; }');
    return element(by.css('thead button.is-danger')).click();
  }

  getChart() {
    return element(by.css('chart'));
  }

  getChartPoints() {
    return element.all(by.css('chart .highcharts-point'));
  }

  private _getTextFromAllElements(selector: string) {
    return element.all(by.css(selector)).map(el => el.getText());
  }
}
