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

    it('api call for log-in', () => {
        // Intercept the API call and mock the response
        cy.intercept('POST', '/api/login', {
            statusCode: 200,
            body: { message: "User not found" },
        }).as('loginRequest');

        mount(<LogIn />);

        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');

        // Simulate user input
        emailInput.type('deep4853867@gmail.com');
        passwordInput.type('Deep@123');

        // Simulate form submission
        submitButton.click();

        // Wait for the API call and assert on its results
        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body.message).to.equal('User not found');
        });

        // Assert on the toast message
        cy.get('[data-testid="tost-message"]').should('have.text', 'User not found!!');
    });
})