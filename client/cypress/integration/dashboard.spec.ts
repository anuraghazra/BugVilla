/// <reference types="cypress" />

describe('Test Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
      .findByPlaceholderText(/example@gmail\.com/i)
      .focus()
      .type('testuser@gmail.com{enter}123456789{enter}');
  });

  it('should go to single bug', function () {
    cy.findByText(/Track Bugs/i)
      .get('.bug__title')
      .first()
      .click()
      .wait(1000);
    cy.url().should('include', '/dashboard/bugs/');
  });

  it('should add a new bug', () => {
    cy.server();
    cy.route('POST', '/api/bugs', 'fixture:add-bug.json');
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
      .findByText(/Preview/i)
      .click()
      .findByText(/Write/i)
      .click()
      .findByText(/submit/i, { selector: 'button' })
      .click();
  });

  it('should add a new comment', () => {
    cy.server();
    cy.route('GET', '/api/bugs', 'fixture:add-bug.json');
    cy.route('GET', '/api/bugs/2', 'fixture:single-bug.json');
    cy.route('PATCH', '/api/bugs/*/comments', 'fixture:add-comment.json');
    cy.findByText(/Cypress testing/i, { selector: 'h3' })
      .click()
      .wait(500)
      .findByPlaceholderText(/write markdown/i)
      .click()
      .type('### Hello Cypres comment')
      .findByText(/Preview/i)
      .click()
      .findByText(/Write/i)
      .click()
      .findByText(/comment/i, { selector: 'button' })
      .click();
  });

  it('should add/remove bug labels', () => {
    cy.server();
    cy.route('GET', '/api/bugs', 'fixture:add-bug.json');
    cy.route('GET', '/api/bugs/2', 'fixture:single-bug.json');
    cy.route('PATCH', '/api/bugs/*/labels', { data: ['bug', 'feature'] });
    cy.findByText(/Cypress testing/i, { selector: 'h3' })
      .click()
      .wait(500)
      .findByTestId('label_dropdown')
      .click()
      .get('.label__dropdown--content')
      .findAllByText(/feature/i)
      .first()
      .click()
      .findByText(/update labels/i)
      .click();
  });
});
