/// <reference types='cypress'/>
let token

beforeEach(() => {
    cy.geratoken("admin@biblioteca.com", "admin123").then(tkn => {
        token = tkn // Agora tkn realmente tem o token!
    });
})

describe('GET - Teste de Api, Gestão de Usuários', () => {

    it('Deve listar usuários com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { Authorization: token }
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.users).to.be.an('array')
        })
    });

    it('Deve validar propriedades de um usuário', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { Authorization: token }
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.users[0]).to.have.property('id')
            expect(response.body.users[0]).to.have.property('name')
            expect(response.body.users[0]).to.have.property('email')
        })
    });

    it('Deve listar um usuario com sucesso buscando por ID', () => {
        cy.api({
            method: 'GET',
            url: 'users/2',
            headers: { Authorization: token }
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('email')
        })
    });

    it('Deve listar usuario com sucesso usando parametros', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { Authorization: token },
            qs: {
                page: 1,
                limit: 20,
                search: 'maria'
            }
        }).should((response) => {
            expect(response.status).to.equal(200)
        })
    });


});

describe('POST - Teste de Api, Gestão de Usuários', () => {
    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `maria10000${Date.now()}@email.com`
        cy.api({
            method: 'POST',
            url: 'users',

            body: {
                "name": "Maria Santos",
                "email": email,
                "password": "senha123"
            }
        }).should((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Usuário criado com sucesso.')
        })
    });

    it('Deve validar um usuário cadastrado com e-mail inválido', () => {
        cy.api({
            method: 'POST',
            url: 'users',

            body: {
                "name": "Maria Santos",
                "email": "maria10000email.com",
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal("Formato de email inválido.")
        })

    });
});

describe('PUT - Teste de Api, Gestão de Usuários', () => {

    it('Deve atualizar um usuário com sucesso', () => {
        cy.api({
            method: 'PUT',
            url: 'users/23',
            headers: { Authorization: token },
            body: {
                "name": "Maria Santos",
                "email": "maria10000updated@email.com",
                "password": "senha123"
            }
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
        })
    });

    it.only('Deve atualizar um usuário com sucesso - de forma dinamica', () => {
        const email = `maria${Date.now()}@email.com`;
        cy.cadastrarUsuario("Maria Santos", email, "senha123")
            .then(userId => {
                expect(userId).to.not.be.undefined;

                cy.api({
                    method: 'PUT',
                    url: `users/${userId}`,
                    headers: { Authorization: token },
                    body: {
                        name: "Maria Santos Atualizada",
                        email: email,
                        password: "novasenha123"
                    }
                }).then(response => {
                    expect(response.status).to.equal(200)
                });
            });



    });
});

