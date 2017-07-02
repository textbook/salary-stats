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

  getRowCount() {
    return element.all(by.css('tbody > tr')).count();
  }

  getNames() {
    return this.getTextFromAllElements('tbody > tr > td.name');
  }

  getHeaders() {
    return this.getTextFromAllElements('thead > tr:first-of-type > th');
  }

  getFirstRow() {
    return this.getTextFromAllElements('tbody > tr:first-of-type > td');
  }

  getLastRow() {
    return this.getTextFromAllElements('tbody > tr:last-of-type > td');
  }

  getCurrentInputs() {
    return element.all(by.css('tfoot input')).map(el => el.getAttribute('value'));
  }

  addNewRow(name: string, salary: number, cohort: string) {
    this.enterRow(name, salary, cohort);
    return element(by.buttonText('Add')).click();
  }

  addNewRowFromKeyboard(name: string, salary: number, cohort: string) {
    this.enterRow(name, salary, cohort);
    return element(by.css('tfoot td.cohort input')).sendKeys(protractor.Key.ENTER);
  }

  clearInputs() {
    return element(by.buttonText('Clear')).click();
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
    return element.all(by.buttonText('Delete')).first().click();
  }

  deleteAllRows() {
    this.alwaysConfirm();
    return element(by.buttonText('Delete All')).click();
  }

  bulkUploadPeople(...people: string[]) {
    this.alwaysConfirm();
    let uploadBox = element(by.id('bulkUpload'));
    people.forEach(person => {
      uploadBox.sendKeys(person, protractor.Key.ENTER);
    });
    return element(by.buttonText('Upload')).click();
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

  getCohortComparison() {
    return element.all(by.css('sst-cohort-comparison'));
  }

  getCohortComparisonPairs() {
    return this.getTextFromAllElements('sst-cohort-comparison .pair-title');
  }

  getCohortComparisonAnalysis() {
    return this.getTextFromAllElements('sst-cohort-comparison .pair-analysis');
  }

  private getTextFromAllElements(selector: string) {
    return element.all(by.css(selector)).map(el => el.getText());
  }

  private alwaysConfirm() {
    browser.executeScript('window.confirm = function() { return true; }');
  }
}
