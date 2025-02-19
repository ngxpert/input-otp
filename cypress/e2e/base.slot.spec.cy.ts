beforeEach(() => {
  cy.visit('/tests/base');
});

describe('Base tests - Slots', () => {
  it('should expose the slot value', () => {
    cy.get('input').as('input');

    cy.get('@input').type('1');
    cy.get('@input').should('have.value', '1');

    cy.get('[data-testid="slot-0"]').should('have.attr', 'data-test-char', '1');

    cy.get('[data-testid="slot-1"]').should('not.have.attr', 'data-test-char');

    cy.get('@input').type('23456');
    cy.get('@input').should('have.value', '123456');

    cy.get('[data-testid="slot-1"]').should('have.attr', 'data-test-char', '2');

    cy.get('[data-testid="slot-2"]').should('have.attr', 'data-test-char', '3');

    cy.get('[data-testid="slot-3"]').should('have.attr', 'data-test-char', '4');

    cy.get('[data-testid="slot-4"]').should('have.attr', 'data-test-char', '5');

    cy.get('[data-testid="slot-5"]').should('have.attr', 'data-test-char', '6');
  });
});
