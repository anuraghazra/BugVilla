/// <reference types="cypress" />

describe('Smoke Testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Should open the app', function () {
    cy.findByText(/login/i);
  });
});
