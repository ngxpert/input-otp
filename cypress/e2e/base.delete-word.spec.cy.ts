beforeEach(() => {
  cy.visit('/tests/base');
});

describe('Backspace', () => {
  it('should backspace previous word (even if there is not a selected character)', () => {
    const input = cy.get('input');

    input.type('1234');
    input.should('have.value', '1234');

    input.clear();
    input.should('have.value', '');
  });
  it('should backspace selected char', () => {
    const input = cy.get('input');

    input.type('123456');
    input.should('have.value', '123456');

    input.type('{leftArrow}');
    input.type('{leftArrow}');
    input.type(`{backspace}`);

    input.should('have.value', '12356');
  });
});
describe('Delete', () => {
  it('should forward-delete character when pressing delete', () => {
    const input = cy.get('input');

    input.type('123456');
    input.should('have.value', '123456');

    input.type('{del}');
    input.should('have.value', '12345');

    input.type('{leftArrow}');
    input.type('{leftArrow}');
    input.type('{leftArrow}');
    input.type('{leftArrow}');
    input.type('{leftArrow}');
    input.type('{del}');
    input.should('have.value', '2345');

    input.type('{rightArrow}');
    input.type('{rightArrow}');
    input.type('{del}');
    input.should('have.value', '235');
  });
});
