import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page = new SalaryStatsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary Statistics');
  });

  it('should display default people', () => {
    expect(page.getPeople().count()).toBeGreaterThan(0);
    page.getNames().then(names => {
      expect(names[0]).toBe('Alice');
    });
  });

  it('should display salary for each person', () => {
    page.getSalaries().then(salaries => {
      expect(salaries[0]).toBe('£12,345');
    });
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      expect(page.getChart().isPresent()).toBe(true, 'chart is not present');
    });
  });
});
