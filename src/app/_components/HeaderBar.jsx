import Link from 'next/link';

function HeaderBar({ authUser, logOut }) {
  return (
    <header className="header-bar">
      <div className="header-bar__menu">
        <button
          aria-label="Navigation button"
          id="hamburgerButton"
          type="button"
        >
          ☰
        </button>
      </div>
      <div className="header-bar__login">
        {authUser === null ? (
          <Link href="/login">Login</Link>
        ) : (
          <button onClick={logOut}>{authUser.username}</button>
        )}
      </div>
      <nav
        id="navigationDrawer"
        className="header-bar__nav"
      >
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
          {authUser === null ? (
            ''
          ) : (
            <li>
              <Link href="/collections">Collections</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default HeaderBar;
