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
    return this._getAllText('tbody > tr > td.name');
  }

  getSalaries() {
    return this._getAllText('tbody > tr > td.salary');
  }

  getChart() {
    return element(by.css('chart'));
  }

  private _getAllText(selector: string) {
    return element.all(by.css(selector)).map(el => el.getText());
  }
}
