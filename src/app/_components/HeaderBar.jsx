'use client';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';
import useOpenNav from '../_hooks/useOpenNav';
import styles from '../_styles/header.module.css';

function HeaderBar({ authUser, logOut }) {
  const [navRef, navOpen, setNavOpen] = useOpenNav();
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();
  const [profileRef, profileOpen, setProfileOpen] = useOpenNav();

  return (
    <header className={styles.header_bar}>
      <div className={styles.header_bar__menu}>
        <button
          aria-label="Navigation button"
          id="hamburgerButton"
          type="button"
          ref={navRef}
          onClick={() => setNavOpen((current) => !current)}
        >
          ☰
        </button>
      </div>
      <div className={styles.header_bar__login}>
        {authUser === null ? (
          <Link href="/login">Login</Link>
        ) : (
          <>
            <span ref={dropdownRef} className={styles.dropdown}>
              <button
                type="button"
                onClick={() => setDropdownOpen((current) => !current)}
              >
                <AiOutlineAppstoreAdd />
              </button>
              <div
                className={`${styles.dropdown_buttons} ${
                  dropdownOpen ? styles.show : ''
                }`}
              >
                <Link href="/album/new">New Album</Link>
                <Link href="/song/new">New Song</Link>
              </div>
            </span>
            <span ref={profileRef} className={styles.profile_menu}>
              <Image
                src={authUser.picture}
                width={30}
                height={30}
                alt="Profile picture"
                onClick={() => setProfileOpen((current) => !current)}
              />
              <div
                className={`${styles.profile_menu_buttons} ${
                  profileOpen ? styles.show : ''
                }`}
              >
                <button onClick={logOut}>
                  <CiLogout /> <span>Logout</span>
                </button>
              </div>
            </span>
          </>
        )}
      </div>
      <nav
        id="navigationDrawer"
        className={`${styles.header_bar__nav} ${navOpen ? styles.open : ''}`}
      >
        <ul onClick={() => setNavOpen((current) => !current)}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
          {authUser === null ? (
            ''
          ) : (
            <>
              <li>
                <Link href="/collections">Collections</Link>
              </li>
              <li>
                <Link href="/profile/me">@{authUser.username}</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default HeaderBar;
