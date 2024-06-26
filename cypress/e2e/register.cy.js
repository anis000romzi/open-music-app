describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('should display register page correctly', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Fullname"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button').contains(/^Register$/).should('be.visible');
  });

  it('should display alert when email is empty', () => {
    cy.get('button').contains(/^Register$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"email" is not allowed to be empty');
    });
  });

  it('should display alert when email format is wrong', () => {
    cy.get('input[placeholder="Email"]').type('test');

    cy.get('button').contains(/^Register$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"email" must be a valid email');
    });
  });

  it('should display alert when username is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');

    cy.get('button').contains(/^Register$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"username" is not allowed to be empty');
    });
  });

  it('should display alert when password is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');

    cy.get('button').contains(/^Register$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });

  it('should display alert when fullname is empty', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');
    cy.get('input[placeholder="Password"]').type('123456');

    cy.get('button').contains(/^Register$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });

  it('should display alert when email already used', () => {
    cy.get('input[placeholder="Email"]').type('testing@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('123456');
 
    cy.get('button').contains(/^Register$/).click();
 
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Gagal menambahkan user. Email sudah digunakan.');
    });
  });

  it('should display alert when username already used', () => {
    cy.get('input[placeholder="Email"]').type('test@gmail.com');
    cy.get('input[placeholder="Username"]').type('tester_tester');
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('123456');
 
    cy.get('button').contains(/^Register$/).click();
 
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Gagal menambahkan user. Username sudah digunakan.');
    });
  });

  it('should display homepage when username or email and password are correct', () => {
    cy.get('input[placeholder="Email"]').type(`test${Date.now()}@example.com`);
    cy.get('input[placeholder="Username"]').type(`user${Date.now()}`);
    cy.get('input[placeholder="Fullname"]').type('Application Tester');
    cy.get('input[placeholder="Password"]').type('123456');
 
    cy.get('button').contains(/^Register$/).click();
 
    cy.get('button[id="send-activation-code"]').should('be.visible');
  });
});