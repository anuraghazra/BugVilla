/// <reference types="cypress" />

describe('Should Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Should not be empty', function () {
    cy.findByText(/login/i)
      .click()
      .findByText(/email must be at least 5 characters/i);
  });
  it('Should report error if invalid username/password', function () {
    cy.findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('doesnotexist@gmail.com{enter}helloworld{enter}')
      .findByText(/Email does not exist/i);
  });
  it('Should report error if invalid password', function () {
    cy.findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('testuser@gmail.com{enter}helloworld{enter}')
      .findByText(/Password Is Incorrect/i);
  });
});
