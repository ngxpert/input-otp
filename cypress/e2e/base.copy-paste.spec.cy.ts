beforeEach(() => {
  cy.visit('/tests/copy-paste');
});

describe('Base tests - Copy paste', { browser: 'electron' }, () => {
  it('should be able to copy and paste', () => {
    cy.get('[data-testid="copy-container"]').type('123456');
    cy.get('[data-testid="copy-button"]').click();
    cy.get('input').focus();
    cy.document().invoke('execCommand', 'paste');
    cy.get('input').should('have.value', '123456');
  });
});
