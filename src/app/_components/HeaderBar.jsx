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
    </header>
  );
}

export default HeaderBar;
