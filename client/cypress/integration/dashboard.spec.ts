/// <reference types="cypress" />

describe('Test Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
      .findByText(/Already have an account\?/i)
      .click()
      .findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('newuser@gmail.com{enter}123456789{enter}')
  })


  it('should go to single bug', function () {
    cy.findByText(/Track Bugs/i).get('.bug__title')
      .first()
      .click()
      .wait(1000)
    cy.url().should('include', '/dashboard/bugs/')
  })

  it('should add a new bug', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/api/bugs',
      response: []
    })
    cy.findByText(/Add/i)
      .click()
      .findByText(/Submit new bug/i)
      .wait(500)
      .findByPlaceholderText(/Enter Title/i)
      .click()
      .type('Cypres testing')
      .findByPlaceholderText(/write markdown/i)
      .click()
      .type('## Cypres testing\n **hello cypress**')
      .findByText(/Preview/i).click()
      .findByText(/Write/i).click()
      .findByText(/submit/i, { selector: 'button' })
      .click()
  })

  it('should add a new comment', () => {
    cy.server();
    cy.route('PATCH', '/api/bugs/*/comments', 'fixture:add-comment.json')
    cy.findByText(/Cypres testing/i, { selector: 'h3' })
      .click()
      .wait(500)
      .findByPlaceholderText(/write markdown/i)
      .click()
      .type('### Hello Cypres comment')
      .findByText(/Preview/i).click()
      .findByText(/Write/i).click()
      .findByText(/comment/i, { selector: 'button' })
      .click()
  })

  it('should add/remove bug labels', () => {
    cy.server();
    cy.route('PATCH', '/api/bugs/*/labels', { "data": ["bug", "feature"] })
    cy.findByText(/Cypres testing/i, { selector: 'h3' })
      .click()
      .wait(500)
      .get('.label__header>svg').click()
      .get('.dropdown__items')
      .findByText(/feature/i).click()
      .findByText(/update labels/i).click()
  })

})
