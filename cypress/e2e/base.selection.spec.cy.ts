beforeEach(() => {
  cy.visit('/tests/base');
});

describe('Base tests - Selections', () => {
  it('should replace selected char if another is pressed', () => {
    cy.get('input').as('input');

    cy.get('@input').type('123');
    cy.get('@input').type('{leftarrow}');
    cy.get('@input').type('1');
    cy.get('@input').should('have.value', '121');
  });
  it('should replace multi-selected chars if another is pressed', () => {
    cy.get('input').as('input');
    cy.get('@input').type('123456');
    cy.get<HTMLInputElement>('@input')
      .then(($el) => $el.get(0).setSelectionRange(3, 6))
      .type('1');
    cy.get('@input').should('have.value', '1231');
  });
  it('should replace last char if another one is pressed', () => {
    cy.get('input').as('input');

    cy.get('@input').type('1234567');
    cy.get('@input').should('have.value', '123457');
  });
});
