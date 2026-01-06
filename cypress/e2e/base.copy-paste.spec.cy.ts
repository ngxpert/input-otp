beforeEach(() => {
  cy.visit('/tests/copy-paste');
});

describe('Base tests - Copy paste', { browser: 'electron' }, () => {
  it('are granted in Electron', { browser: 'electron' }, () => {
    cy.visit('index.html') // yields the window object
      .its('navigator.permissions')
      // permission names taken from
      // https://w3c.github.io/permissions/#enumdef-permissionname
      .then((permissions) => permissions.query({ name: 'clipboard-read' }))
      .its('state')
      .should('equal', 'granted');
  });
  it('should be able to copy and paste', () => {
    cy.get('[data-testid="copy-container"]').type('123456');
    cy.get('[data-testid="copy-button"]').click();
    // confirm the clipboard's contents
    cy.window()
      .its('navigator.clipboard')
      .then((clip) => clip.readText())
      .then((text) => {
        cy.get('input').type(text);
        cy.get('input').should('have.value', '123456');
      });
  });
});
