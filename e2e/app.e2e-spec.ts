import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page = new SalaryStatsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary Statistics');
  });
});
