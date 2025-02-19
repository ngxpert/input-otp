beforeEach(() => {
  cy.visit('/tests/base');
});

describe('Base tests - Typing', () => {
  it('should start as empty value', () => {
    cy.get('input').should('have.value', '');
  });

  it('should change the input value', () => {
    cy.get('input').type('1').should('have.value', '1');

    cy.get('input').type('23456').should('have.value', '123456');
  });

  it('should prevent typing greater than max length', () => {
    cy.get('input').type('1234567').should('have.value', '123457');
  });
});
