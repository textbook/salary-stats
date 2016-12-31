import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page: SalaryStatsPage;

  beforeEach(() => {
    page = new SalaryStatsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
