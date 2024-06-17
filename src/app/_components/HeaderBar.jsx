'use client';
import { usePathname } from 'next/navigation';
import useOpenNav from '../_hooks/useOpenNav';
import Link from 'next/link';
import Image from 'next/image';
import { FaHouse } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import { IoMoonOutline } from 'react-icons/io5';
import { IoLanguage } from 'react-icons/io5';
import { VscFeedback } from 'react-icons/vsc';
import { TbMusicPlus } from 'react-icons/tb';
import { BiAlbum } from 'react-icons/bi';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { FaCircleInfo } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { LuDownload } from 'react-icons/lu';
import styles from '../_styles/header.module.css';

function HeaderBar({ authUser, logOut }) {
  const pathname = usePathname();
  const [navRef, navOpen, setNavOpen] = useOpenNav();
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();
  const [profileRef, profileOpen, setProfileOpen] = useOpenNav();

  return (
    <header ref={navRef} className={`${styles.header_bar} ${navOpen ? styles.open : ''}`}>
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
            <span ref={dropdownRef} className={styles.new_content_menu}>
              <button
                id="new-content"
                className={styles.new_content}
                type="button"
                onClick={() => setDropdownOpen((current) => !current)}
              >
                <span>New Content </span>
                <TbMusicPlus />
              </button>
              <div
                className={`${styles.new_content_menu_buttons} ${
                  dropdownOpen ? styles.show : ''
                }`}
              >
                <Link href="/album/new">
                  <BiAlbum /> <span>New Album</span>
                </Link>
                <Link href="/song/new">
                  <IoMusicalNotesOutline /> <span>New Song</span>
                </Link>
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
                <Link href="/profile/me" className={styles.info}>
                  <Image
                    src={authUser.picture}
                    width={40}
                    height={40}
                    alt="Profile picture"
                  />
                  <div>
                    <p>{authUser.fullname}</p>
                    <em>@{authUser.username}</em>
                  </div>
                </Link>
                <button onClick={logOut}>
                  <LuLogOut /> <span>Logout</span>
                </button>
                {/* <button>
                  <IoMoonOutline /> <span>Theme</span>
                </button>
                <button>
                  <IoLanguage /> <span>Language</span>
                </button> */}
              </div>
            </span>
          </>
        )}
      </div>
      <nav
        id="navigationDrawer"
        className={`${styles.header_bar__nav} ${navOpen ? styles.open : ''}`}
      >
        <ul>
          <li className={`${pathname === '/' && styles.active}`}>
            <Link href="/">
              <FaHouse /> <span>Home</span>
            </Link>
          </li>
          <li className={`${pathname === '/search' && styles.active}`}>
            <Link href="/search">
              <FaSearch /> <span>Search</span>
            </Link>
          </li>
          {authUser === null ? (
            ''
          ) : (
            <>
              <li className={`${pathname === '/collections' && styles.active}`}>
                <Link href="/collections">
                  <MdOutlineCollectionsBookmark /> <span>Collections</span>
                </Link>
              </li>
              <li className={`${pathname === '/profile/me' && styles.active}`}>
                <Link href="/profile/me">
                  <MdOutlineAlternateEmail /> <span>{authUser.username}</span>
                </Link>
              </li>
            </>
          )}
          <li className={`${pathname === '/song/downloaded' && styles.active}`}>
            <Link href="/song/downloaded">
              <LuDownload /> <span>Downloaded</span>
            </Link>
          </li>
          {/* <li className={`${pathname === '/feedback' && styles.active}`}>
            <Link href="/feedback">
              <VscFeedback /> <span>Feedback</span>
            </Link>
          </li> */}
          <li className={`${pathname === '/about' && styles.active}`}>
            <Link href="/about">
              <FaCircleInfo /> <span>About</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderBar;
