beforeEach(() => {
  cy.visit('/tests/base');
});

describe('Base tests - Render', () => {
  it('should expose focus flags', () => {
    cy.get('input').as('input');
    cy.get('[data-testid="input-otp-renderer"]').as('renderer');

    cy.get('@input').focus();
    cy.get('@renderer').should(
      'have.attr',
      'data-test-render-is-focused',
      'true',
    );

    cy.get('@input').blur();
    cy.get('@renderer').should('not.have.attr', 'data-test-render-is-focused');
  });
  it('should expose hover flags', async () => {
    cy.get('[data-testid="input-otp-renderer"]').as('renderer');
    cy.get('@renderer').should('not.have.attr', 'data-test-render-is-hovering');

    cy.get('@renderer').then((el) => {
      const rect = el.get(0).getBoundingClientRect();
      cy.get('body').trigger(
        'mouseenter',
        rect.x + rect.width / 2,
        rect.y + rect.height / 2,
      );
    });

    cy.get('@renderer').should(
      'have.attr',
      'data-test-render-is-hovering',
      'true',
    );
  });
});
