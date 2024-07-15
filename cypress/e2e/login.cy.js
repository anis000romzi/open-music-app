describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should display login page correctly', () => {
    cy.get('input[placeholder="Username or Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Login$/)
      .should('be.visible');
  });

  it('should display alert when username or email is empty', () => {
    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"usernameOrEmail" is not allowed to be empty');
  });

  it('should display alert when password is empty', () => {
    cy.get('input[placeholder="Username or Email"]').type('testuser');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"password" is not allowed to be empty');
  });

  it('should display alert when username or email and password are wrong', () => {
    cy.get('input[placeholder="Username or Email"]').type('testuser');
    cy.get('input[placeholder="Password"]').type('wrong_password');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('.Toastify__toast-body')
    .find('div:not([class])')
    .should('have.text', 'Username/email or password wrong');
  });

  it('should display homepage when username or email and password are correct', () => {
    cy.get('input[placeholder="Username or Email"]').type('romzianis');
    cy.get('input[placeholder="Password"]').type('152315');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('button[id="new-content"]').should('be.visible');
  });
});
