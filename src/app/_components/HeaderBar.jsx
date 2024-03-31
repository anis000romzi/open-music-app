'use client';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import useOpenNav from '../_hooks/useOpenNav';
import styles from '../_styles/header.module.css';
import { useState } from 'react';

function HeaderBar({ authUser, logOut }) {
  const { ref, navOpen, setNavOpen } = useOpenNav();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header ref={ref} className={styles.header_bar}>
      <div className={styles.header_bar__menu}>
        <button
          aria-label="Navigation button"
          id="hamburgerButton"
          type="button"
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
            <span className={styles.dropdown}>
              <button
                type="button"
                onClick={() => setDropdownOpen((current) => !current)}
              >
                <AiOutlineAppstoreAdd />
              </button>
              <div className={`${styles.dropdown_buttons} ${dropdownOpen ? styles.show : ''}`} id="myDropdown">
                <Link href="/album/new">New Album</Link>
                <Link href="/song/new">New Song</Link>
              </div>
            </span>
            <Image
              src={authUser.picture}
              width={30}
              height={30}
              alt="Profile picture"
            />
          </>
        )}
      </div>
      <nav
        id="navigationDrawer"
        className={`${styles.header_bar__nav} ${navOpen ? styles.open : ''}`}
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
            <>
              <li>
                <Link href="/collections">Collections</Link>
              </li>
              <li>
                <button onClick={logOut}>@{authUser.username}</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default HeaderBar;
