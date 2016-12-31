import { browser, element, by } from 'protractor';

export class SalaryStatsPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('sst-root h1')).getText();
  }

  getPeople() {
    return element.all(by.css('sst-person'));
  }

  getNames() {
    return element.all(by.css('sst-person .name')).map(el => el.getText());
  }
}
