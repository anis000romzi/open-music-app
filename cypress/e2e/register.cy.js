describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('should display register page correctly', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Fullname"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Register$/)
      .should('be.visible');
  });

  it('should display alert when email is empty', () => {
    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"email" is not allowed to be empty');
  });

  it('should display alert when email format is wrong', () => {
    cy.get('input[placeholder="Email"]').type('test');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"email" must be a valid email');
  });

  it('should display alert when username is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"username" is not allowed to be empty');
  });

  it('should display alert when password is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"password" is not allowed to be empty');
  });

  it('should display alert when fullname is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');
    cy.get('input[placeholder="Password"]').type('12345678');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', '"fullname" is not allowed to be empty');
  });

  it('should display alert when email already used', () => {
    cy.get('input[placeholder="Email"]').type('testing@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester2');
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('12345678');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', 'Email is already in use');
  });

  it('should display alert when username already used', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('1234578');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('.Toastify__toast-body')
      .find('div:not([class])')
      .should('have.text', 'Username is already in use');
  });

  it('should display homepage when username or email and password are correct', () => {
    cy.get('input[placeholder="Email"]').type(`test${Date.now()}@example.com`);
    cy.get('input[placeholder="Username"]').type(`user${Date.now()}`);
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('12345678');

    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('button[id="send-activation-code"]').should('be.visible');
  });
});
