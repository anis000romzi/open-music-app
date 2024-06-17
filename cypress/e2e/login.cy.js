describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should display login page correctly', () => {
    cy.get('input[placeholder="Username or Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button').contains(/^Login$/).should('be.visible');
  });

  it('should display alert when username or email is empty', () => {
    cy.get('button').contains(/^Login$/).click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"usernameOrEmail" is not allowed to be empty');
    });
  });

  it('should display alert when password is empty', () => {
    // mengisi username
    cy.get('input[placeholder="Username or Email"]').type('testuser');
 
    // klik tombol login tanpa mengisi password
    cy.get('button').contains(/^Login$/).click();
 
    // memverifikasi window.alert untuk menampilkan pesan dari API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });

  it('should display alert when username or email and password are wrong', () => {
    // mengisi username
    cy.get('input[placeholder="Username or Email"]').type('testuser');
 
    // mengisi password yang salah
    cy.get('input[placeholder="Password"]').type('wrong_password');
 
    // menekan tombol Login
    cy.get('button').contains(/^Login$/).click();
 
    // memverifikasi window.alert untuk menampilkan pesan dari API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Kredensial yang anda berikan salah');
    });
  });

  it('should display homepage when username or email and password are correct', () => {
    // mengisi username
    cy.get('input[placeholder="Username or Email"]').type('romzianis');
 
    // mengisi password
    cy.get('input[placeholder="Password"]').type('152315');
 
    // menekan tombol Login
    cy.get('button').contains(/^Login$/).click();
 
    // memverifikasi bahwa elemen yang berada di homepage ditampilkan
    cy.get('button[id="new-content"]').should('be.visible');
  });
});