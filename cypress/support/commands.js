// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Gerar token
Cypress.Commands.add('gerarToken', () => {
  return cy.request({
    method: 'POST',
    url: '/api/login',
    body: {
      email: 'admin@biblioteca.com',
      password: 'admin123'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    return response.body.token
  })
})


Cypress.Commands.add('criarUsuario', (token, nome, email, senha) => {
  return cy.request({
    method: 'POST',
    url: '/api/users',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      name: nome,
      email: email,
      password: senha
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    return response.body.id
  })
})





