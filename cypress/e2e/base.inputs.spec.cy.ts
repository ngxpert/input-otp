beforeEach(() => {
  cy.visit('/tests/inputs');
});

describe('Inputs tests', () => {
  it('should receive props accordingly', () => {
    const input1 = cy.get('[data-testid="input-otp-1"] input');
    input1.should('be.disabled');

    const input2 = cy.get('[data-testid="input-otp-2"] input');
    input2.should('have.attr', 'inputmode', 'numeric');

    const input3 = cy.get('[data-testid="input-otp-3"] input');
    input3.should('have.attr', 'inputmode', 'text');

    const container4 = cy.get(
      '[data-testid="input-otp-4"] [data-input-otp-container]',
    );
    container4.should('have.class', 'testclassname');
    const input5 = cy.get('[data-testid="input-otp-5"] input');
    input5.should('have.attr', 'maxlength', '3');

    const input6 = cy.get('[data-testid="input-otp-6"] input');
    input6.should('have.attr', 'id', 'testid');
    input6.should('have.attr', 'name', 'testname');

    const input7 = cy.get('[data-testid="input-otp-7"] input');
    input7.should('have.attr', 'pattern', ' ');
  });
});
