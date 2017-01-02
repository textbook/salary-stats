import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page = new SalaryStatsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary Statistics');
  });

  it('should display three default people', () => {
    expect(page.getPeople().count()).toBe(3);
    expect(page.getNames()).toContain('Alice');
  });

  it('should display name and salary for each person', () => {
    expect(page.getNames()).toEqual(['Alice', 'Bob', 'Chris']);
    expect(page.getSalaries()).toEqual(['£12,345', '£12,435', '£12,534']);
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      expect(page.getChart().isPresent()).toBe(true, 'chart is not present');
    });
  });
});
