/// <reference types="cypress" />

describe('Should Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
      .findByText(/Already have an account\?/i)
      .click()
  })

  it('Login user', function () {
    cy.findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('newuser@gmail.com{enter}123456789{enter}')
      .findByText(/Track Bugs/i).get('.bug__title')
      .first()
      .click()
      .wait(1000)
      .findByText(/^Opened by/)
  })

})
