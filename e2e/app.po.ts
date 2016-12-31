import { browser, element, by } from 'protractor';

export class SalaryStatsPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('sst-root h1')).getText();
  }
}
