beforeEach(() => {
  cy.visit('/tests/with-focus-afterinit');
});

describe('With autofocus tests', () => {
  it('should autofocus', () => {
    cy.get('input').should('be.focused');
  });
});
