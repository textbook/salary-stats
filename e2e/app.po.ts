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
    return element.all(by.css('tbody > tr > td.name')).map(el => el.getText());
  }
}
