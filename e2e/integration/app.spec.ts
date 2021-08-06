describe('salary-stats App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display application title', () => {
    cy.findByRole('heading', { level: 1 }).should('contain.text', 'Salary statistics');
  });

  describe('person table', () => {
    it('should display default people', () => {
      cy.findAllByRole('row').should('have.length.greaterThan', 0);
      cy.findAllByRole('row').eq(1).within(() => {
        cy.findAllByRole('cell').eq(0).should('contain.text', 'Alice');
      });
    });

    it('should display name, salary, cohort and a delete button for each person', () => {
      cy.findAllByRole('row').eq(0).within(() => {
        cy.findAllByRole('columnheader').eq(0).should('contain.text', 'Name');
        cy.findAllByRole('columnheader').eq(1).should('contain.text', 'Salary');
        cy.findAllByRole('columnheader').eq(2).should('contain.text', 'Cohort');
        cy.findAllByRole('columnheader').eq(3).should('contain.text', 'Delete All');
      });
      cy.findAllByRole('row').eq(1).within(() => {
        cy.findAllByRole('cell').eq(0).should('contain.text', 'Alice');
        cy.findAllByRole('cell').eq(1).should('contain.text', '£12,345');
        cy.findAllByRole('cell').eq(2).should('contain.text', 'A');
        cy.findAllByRole('cell').eq(3).should('contain.text', 'Delete');
      });
    });

    it('should allow a person to be deleted', () => {
      cy.findAllByRole('row').its('length').then((initialCount) => {
        cy.findAllByRole('row').eq(1).within(() => {
          cy.findByRole('button', { name: 'Delete' }).click();
        });
        cy.findAllByRole('row').should('have.length', initialCount - 1)
        cy.findAllByRole('row').eq(1).within(() => {
          cy.findAllByRole('cell').eq(0).should('contain.text', 'Bob');
          cy.findAllByRole('cell').eq(1).should('contain.text', '£12,435');
          cy.findAllByRole('cell').eq(2).should('contain.text', 'A');
          cy.findAllByRole('cell').eq(3).should('contain.text', 'Delete');
        });
      });
    });

    it('should allow all people to be deleted', () => {
      cy.findAllByRole('row').should('have.length.greaterThan', 0);

      cy.findByRole('button', { name: 'Delete All' }).click();

      cy.findAllByRole('row').should('have.length', 2);
    });

    it('should allow a person to be added', () => {
      cy.findAllByRole('row').its('length').then((initialCount) => {
        cy.findByPlaceholderText('Name').type('Keira');
        cy.findByPlaceholderText('Salary').type('14532');
        cy.findByPlaceholderText('Cohort').type('C');
        cy.findByRole('button', { name: 'Add' }).click();

        cy.findAllByRole('row').should('have.length', initialCount + 1)
        cy.findAllByRole('row').eq(initialCount - 1).within(() => {
          cy.findAllByRole('cell').eq(0).should('contain.text', 'Keira');
          cy.findAllByRole('cell').eq(1).should('contain.text', '£14,532');
          cy.findAllByRole('cell').eq(2).should('contain.text', 'C');
          cy.findAllByRole('cell').eq(3).should('contain.text', 'Delete');
        });
        cy.focused().should('have.attr', 'placeholder', 'Name');
      });
    });

    it('should allow a person to be added from the keyboard', () => {
      cy.findAllByRole('row').its('length').then((initialCount) => {
        cy.findByPlaceholderText('Name').type('Keira');
        cy.findByPlaceholderText('Salary').type('14532');
        cy.findByPlaceholderText('Cohort').type('C{enter}');

        cy.findAllByRole('row').should('have.length', initialCount + 1)
        cy.findAllByRole('row').eq(initialCount - 1).within(() => {
          cy.findAllByRole('cell').eq(0).should('contain.text', 'Keira');
          cy.findAllByRole('cell').eq(1).should('contain.text', '£14,532');
          cy.findAllByRole('cell').eq(2).should('contain.text', 'C');
          cy.findAllByRole('cell').eq(3).should('contain.text', 'Delete');
        });
        cy.focused().should('have.attr', 'placeholder', 'Name');
      });
    });

    it('should allow inputs to be cleared', () => {
      cy.findByPlaceholderText('Name').type('Keira');
      cy.findByPlaceholderText('Salary').type('14532');
      cy.findByPlaceholderText('Cohort').type('C');

      cy.findByRole('button', { name: 'Clear' }).click();

      cy.findByPlaceholderText('Name').should('have.value', '');
      cy.findByPlaceholderText('Salary').should('have.value', '');
      cy.findByPlaceholderText('Cohort').should('have.value', '');
    });
  });

  describe('salary chart', () => {
    it('should be displayed', () => {
      cy.get('highcharts-chart').should('exist');
    });

    it('should display a box plot for each cohort', () => {
      cy
        .get('highcharts-chart .highcharts-boxplot-series .highcharts-point')
        .should('have.length.greaterThan', 1);
    });

    it('should display a point for each outlier', () => {
      cy
        .get('highcharts-chart .highcharts-scatter-series .highcharts-point')
        .should('have.length.greaterThan', 0);
    });
  });

  describe('cohort comparison', () => {
    it('should display each cohort pair', () => {
      cy.findByPlaceholderText('Name').type('Keira');
      cy.findByPlaceholderText('Salary').type('14532');
      cy.findByPlaceholderText('Cohort').type('C');
      cy.findByRole('button', { name: 'Add' }).click();

      cy.get('sst-cohort-comparison .pair-title').eq(0).should('contain.text', 'A to B');
      cy.get('sst-cohort-comparison .pair-title').eq(1).should('contain.text', 'A to C');
      cy.get('sst-cohort-comparison .pair-title').eq(2).should('contain.text', 'B to C');
    });

    it('should display the p value and statistical significance', () => {
      cy.get('sst-cohort-comparison .pair-analysis').should(
          'contain.text',
          'The difference between these cohorts is statistically significant since P: 0.0135 < 0.05.'
        )
    });
  });

  describe('bulk upload', () => {
    it('should allow the user to add multiple people', () => {
      cy.findAllByRole('row').its('length').then((initialLength) => {
        cy.findByPlaceholderText('Enter CSV data').type('Alex,123,A{enter}Bea,234,B');
        cy.on('window:confirm', () => true);
        cy.findByRole('button', { name: 'Upload' }).click();

        cy.findAllByRole('row').should('have.length', initialLength + 2);
        cy.findAllByRole('row').eq(initialLength).within(() => {
          cy.findAllByRole('cell').eq(0).should('contain.text', 'Bea');
          cy.findAllByRole('cell').eq(1).should('contain.text', '£234');
          cy.findAllByRole('cell').eq(2).should('contain.text', 'B');
          cy.findAllByRole('cell').eq(3).should('contain.text', 'Delete');
        });
        cy.findByPlaceholderText('Name').should('have.value', '');
        cy.findByPlaceholderText('Salary').should('have.value', '');
        cy.findByPlaceholderText('Cohort').should('have.value', '');
      });
    });
  });
});
