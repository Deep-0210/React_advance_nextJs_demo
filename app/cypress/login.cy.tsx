import LogIn from '../page'

describe('Log-In test cases', () => {
    it('Check for log-in text', () => {
        cy.mount(<LogIn/>)
        cy.contains('Log-In');
    })

    it('email input', async () => {
        cy.mount(<LogIn />)
        cy.get('input[placeholder="Email"]').type('deep485386@gmail.com');
        cy.get('input[placeholder="Email"]').should('have.value', 'deep485386@gmail.com');

    });

    it('password input', async () => {
        cy.mount(<LogIn />)
        cy.get('input[placeholder="Password"]').type('Deep@123');
        cy.get('input[placeholder="Password"]').should('have.value', 'Deep@123');

    });

    it('validation check', () => {
        cy.mount(<LogIn />);
        
        const emailInput = cy.get('input[placeholder="Email"]');
        const passwordInput = cy.get('input[placeholder="Password"]');
        const submitButton = cy.contains('Submit');
        
        emailInput.type('deep485386@gmail');
        passwordInput.type('Deep'); 
        
        submitButton.click();
        
        cy.get('[data-testid="ok-password"]').should('have.class', 'border-2 border-red-700');
        cy.get('[data-testid="ok-email"]').should('have.class', 'border-2 border-red-700');
      });
})