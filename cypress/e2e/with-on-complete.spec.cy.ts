beforeEach(() => {
  cy.visit('/tests/with-on-complete');
});

describe('With on complete tests', () => {
  it('should change the input value', () => {
    cy.get('input')
      .type('123456')
      .should('have.value', '123456')
      .should('be.disabled');
  });
});
