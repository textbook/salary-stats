import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  let page = new SalaryStatsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary Statistics');
  });

  describe('person table', () => {
    it('should display default people', () => {
      expect(page.getPeople().count()).toBeGreaterThan(0);
      page.getNames().then(names => {
        expect(names[0]).toBe('Alice');
      });
    });

    it('should display name, salary, cohort and a delete button for each person', () => {
      expect(page.getHeaders()).toEqual(['Name', 'Salary', 'Cohort', 'Delete All']);
      expect(page.getFirstRow()).toEqual(['Alice', '£12,345', 'A', 'Delete']);
    });

    it('should allow people to be deleted', () => {
      page.getPeople().count().then(initialCount => {
        page.deleteFirstRow();

        expect(page.getPeople().count()).toBe(initialCount - 1);
        expect(page.getFirstRow()).toEqual(['Bob', '£12,435', 'A', 'Delete']);
      });
    });

    it('should allow all people to be deleted', () => {
      expect(page.getPeople().count()).toBeGreaterThan(0);

      page.deleteAllRows();

      expect(page.getPeople().count()).toBe(0);
    });

    it('should allow people to be added', () => {
      page.getPeople().count().then(initialCount => {
        page.addNewRow('Keira', 14532, 'C');

        expect(page.getPeople().count()).toBe(initialCount + 1);
        expect(page.getLastRow()).toEqual(['Keira', '£14,532', 'C', 'Delete']);
      });
    });

    it('should allow entries to be cleared', () => {
      page.enterRow('Keira', 14532, 'C');
      expect(page.getCurrentInputs()).toEqual(['Keira', '14532', 'C']);

      page.clearInputs();

      expect(page.getCurrentInputs()).toEqual(['', '', '']);
    });
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      expect(page.getChart().isPresent()).toBe(true, 'chart is not present');
    });

    it('should display a box plot for each cohort', () => {
      expect(page.getCohortBoxPlots().count()).toBeGreaterThan(1);
    });

    it('should display a point for each outlier', () => {
      expect(page.getOutlierPoints().count()).toBeGreaterThan(0);
    });
  });
});
