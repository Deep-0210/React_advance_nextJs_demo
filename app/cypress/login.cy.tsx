import React = require('react');
import LogIn from '../page'
import { mount } from '@cypress/react';

describe('Log-In test cases', () => {
    it('Check for log-in text', () => {
        mount(<LogIn />)
        cy.contains('Log-In');
    })

    it('email input', async () => {
        mount(<LogIn />)
        cy.get('input[placeholder="Email"]').type('deep485386@gmail.com');
        cy.get('input[placeholder="Email"]').should('have.value', 'deep485386@gmail.com');

    });

    it('password input', async () => {
        mount(<LogIn />)
        cy.get('input[placeholder="Password"]').type('Deep@123');
        cy.get('input[placeholder="Password"]').should('have.value', 'Deep@123');

    });

    it('validation check', () => {
        mount(<LogIn />);

        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');

        emailInput.type('deep485386@gmail');
        passwordInput.type('Deep');

        submitButton.click();

        cy.get('[data-testid="ok-password"]').should('have.class', 'border-2 border-red-700');
        cy.get('[data-testid="ok-email"]').should('have.class', 'border-2 border-red-700');
    });

    it('api call for log-in with invalid credentials', () => {
        cy.intercept('POST', '/api/logIn', (req) => {
            console.log('Request intercepted:', req);
            expect(req.body).to.deep.equal({
                email: 'deep485386@gmail.com',
                password: 'Deep@1234'
            });
            req.reply({
                statusCode: 200,
                body: { message: "Please check your email or password" }
            });
        }).as('loginRequest');

        mount(<LogIn />);

        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');

        emailInput.type('deep485386@gmail.com');
        passwordInput.type('Deep@1234');

        submitButton.click();

        cy.wait('@loginRequest').then((interception) => {
            console.log('Interception:', interception);
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body.message).to.equal('Please check your email or password');
        });

        cy.get('[data-testid="tost-message"]').should('have.text', 'Invalid Credentials!!');
    });
})