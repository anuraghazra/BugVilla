// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@testing-library/cypress/add-commands';
Cypress.on('fail', (error, runnable) => {
  debugger;

  // we now have access to the err instance
  // and the mocha runnable this failed on

  throw error; // throw error to have test still fail
});
