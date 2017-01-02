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

  deleteFirstRow() {
    return element.all(by.css('button.is-danger')).first().click();
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
