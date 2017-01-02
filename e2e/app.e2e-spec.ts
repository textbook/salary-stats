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

  it('should display name, salary and cohort for each person', () => {
    expect(page.getHeaders()).toEqual(['Name', 'Salary', 'Cohort']);
    expect(page.getFirstRow()).toEqual(['Alice', '£12,345', 'A']);
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      expect(page.getChart().isPresent()).toBe(true, 'chart is not present');
    });

    it('should display a point for each cohort', () => {
      expect(page.getChartPoints().count()).toBeGreaterThan(1);
    });
  });
});
