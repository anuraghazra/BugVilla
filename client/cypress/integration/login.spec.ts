/// <reference types="cypress" />

describe('Should Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
      .findByText(/Already have an account\?/i)
      .click()
  })

  it('Should not be empty', function () {
    cy.findByText(/login/i)
      .click()
      .findByText(/email must be at least 5 characters/i)
  })
  it('Should report error if invalid username/password', function () {
    cy.findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('doesnotexist@gmail.com{enter}helloworld{enter}')
      .findByText(/Email does not exsist/i)
  })
  it('Should report error if invalid password', function () {
    cy.findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('hazru.anurag@gmail.com{enter}helloworld{enter}')
      .findByText(/Password Is Incorrect/i)
  })
})
