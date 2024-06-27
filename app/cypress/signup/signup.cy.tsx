import { mount } from "@cypress/react";
import SignUp from '../../signUp/page'
import React = require("react");

describe('', () => {

    it('Check for log-in text', () => {
        mount(<SignUp />)
        cy.contains('Log-In');
    })

    it('email input', async () => {
        mount(<SignUp />)
        cy.get('input[placeholder="Email"]').type('deep485386@gmail.com');
        cy.get('input[placeholder="Email"]').should('have.value', 'deep485386@gmail.com');

    });

    it('password input', async () => {
        mount(<SignUp />)
        cy.get('input[placeholder="Password"]').type('Deep@123');
        cy.get('input[placeholder="Password"]').should('have.value', 'Deep@123');

    });

    it('validation check', () => {
        mount(<SignUp />);

        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');

        emailInput.type('deep485386@gmail');
        passwordInput.type('Deep');

        submitButton.click();

        cy.get('[data-testid="ok-password"]').should('have.class', 'border-2 border-red-700');
        cy.get('[data-testid="ok-email"]').should('have.class', 'border-2 border-red-700');
    });

    it("check for user exist", async () => {
        cy.intercept('post', '/api/signUp', (req) => {
            expect(req.body).to.deep.equal({
                email: "deep485386@gmail.com",
                password: "Deep@123"
            });
            req.reply({
                statusCode: 200,
                body: { userExist: "User exist" }
            });
        }).as("signUpRequest");

        mount(<SignUp />);

        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');

        emailInput.type('deep485386@gmail.com');
        passwordInput.type('Deep@123');

        submitButton.click();

        cy.wait('@signUpRequest').then((interception) => {
            console.log('Interception:', interception);
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body.message).to.equal('User exist');
        });

        cy.get('[data-testid="tost-message"]').should('have.text', 'User Exist');
    });
})