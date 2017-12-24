import { browser } from 'protractor';

import { SalaryStatsPage } from './app.po';

describe('salary-stats App', function() {
  const page = new SalaryStatsPage();

  beforeAll(() => {
    // Until https://github.com/angular/protractor/issues/4584 is resolved
    browser.waitForAngularEnabled(false);
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('should display application title', () => {
    expect(page.getTitleText()).toEqual('Salary statistics');
  });

  describe('person table', () => {
    it('should display default people', () => {
      expect(page.getRowCount()).toBeGreaterThan(0);
      page.getNames().then(names => {
        expect(names[0]).toBe('Alice');
      });
    });

    it('should display name, salary, cohort and a delete button for each person', () => {
      expect(page.getHeaders()).toEqual(['Name', 'Salary', 'Cohort', 'Delete All']);
      expect(page.getFirstRow()).toEqual(['Alice', '£12,345', 'A', 'Delete']);
    });

    it('should allow a person to be deleted', () => {
      page.getRowCount().then(initialCount => {
        page.deleteFirstRow();

        expect(page.getRowCount()).toBe(initialCount - 1);
        expect(page.getFirstRow()).toEqual(['Bob', '£12,435', 'A', 'Delete']);
      });
    });

    it('should allow all people to be deleted', () => {
      expect(page.getRowCount()).toBeGreaterThan(0);

      page.deleteAllRows();

      expect(page.getRowCount()).toBe(0);
    });

    it('should allow a person to be added', () => {
      page.getRowCount().then(initialCount => {
        page.addNewRow('Keira', 14532, 'C');

        expect(page.getRowCount()).toBe(initialCount + 1);
        expect(page.getLastRow()).toEqual(['Keira', '£14,532', 'C', 'Delete']);
        expect(page.getNameInput().getId()).toBe(page.getActiveElement().getId());
      });
    });

    it('should allow a person to be added from the keyboard', () => {
      page.getRowCount().then(initialCount => {
        page.addNewRowFromKeyboard('Keira', 14532, 'C');

        expect(page.getRowCount()).toBe(initialCount + 1);
        expect(page.getLastRow()).toEqual(['Keira', '£14,532', 'C', 'Delete']);
        expect(page.getNameInput().getId()).toBe(page.getActiveElement().getId());
      });
    });

    it('should allow inputs to be cleared', () => {
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

  describe('cohort comparison', () => {
    it('should be displayed', () => {
      expect(page.getCohortComparison().isPresent()).toBe(true, 'cohort comparison is not present');
    });

    it('should display each cohort pair', () => {
      page.addNewRow('Keira', 14532, 'C');

      expect(page.getCohortComparisonPairs()).toEqual(['A to B', 'A to C', 'B to C']);
    });

    it('should display the p value and statistical significance', () => {
      expect(page.getCohortComparisonAnalysis())
          .toEqual(['The difference between these cohorts is statistically significant since P: 0.0135 < 0.05.']);
    });
  });

  describe('bulk upload', () => {
    it('should allow the user to add multiple people', () => {
      page.bulkUploadPeople('Alex,123,A', 'Bea,234,B');

      expect(page.getRowCount()).toBe(12);
      expect(page.getLastRow()).toEqual(['Bea', '£234', 'B', 'Delete']);
      expect(page.getCurrentInputs()).toEqual(['', '', '']);
    });

    it('should not allow the user to submit empty bulk data', () => {
      page.bulkUploadPeople();

      expect(page.getRowCount()).toBeGreaterThan(0);
    });
  });
});
