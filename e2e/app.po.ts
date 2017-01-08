import { browser, element, by, protractor } from 'protractor';

export class SalaryStatsPage {
  navigateTo() {
    return browser.get('/');
  }

  getActiveElement() {
    return browser.driver.switchTo().activeElement();
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

  getCurrentInputs() {
    return element.all(by.css('tfoot input')).map(el => el.getAttribute('value'));
  }

  addNewRow(name: string, salary: number, cohort: string) {
    this.enterRow(name, salary, cohort);
    return element(by.css('tfoot button.is-success')).click();
  }

  addNewRowFromKeyboard(name: string, salary: number, cohort: string) {
    this.enterRow(name, salary, cohort);
    return element(by.css('tfoot td.cohort input')).sendKeys(protractor.Key.ENTER);
  }

  clearInputs() {
    return element(by.css('tfoot button.is-warning')).click();
  }

  getNameInput() {
    return element(by.css('tfoot > tr > td.name > input'));
  }

  enterRow(name: string, salary: number, cohort: string) {
    this.getNameInput().sendKeys(name);
    element(by.css('tfoot > tr > td.salary > input')).sendKeys(salary.toString());
    element(by.css('tfoot > tr > td.cohort > input')).sendKeys(cohort);
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

  getCohortBoxPlots() {
    return element.all(by.css('chart .highcharts-boxplot-series .highcharts-point'));
  }

  getOutlierPoints() {
    return element.all(by.css('chart .highcharts-scatter-series .highcharts-point'));
  }

  private _getTextFromAllElements(selector: string) {
    return element.all(by.css(selector)).map(el => el.getText());
  }
}
