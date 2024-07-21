'use client';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUnsetAuthUser } from '@/app/_states/authUser/action';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { CiLogout } from 'react-icons/ci';
import styles from '../../_styles/style.module.css';

function Banned() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(asyncUnsetAuthUser());
  }, [dispatch]);

  if (!authUser) {
    redirect('/login');
  }

  if (authUser.is_active && !authUser.is_banned) {
    redirect('/');
  }

  return (
    <main className={styles.banned_page}>
      <button className={styles.banned_page__logout} onClick={logOut}>
        <CiLogout />
      </button>
      <Image
        src={authUser.picture}
        width={150}
        height={150}
        alt="Profile picture"
        priority
      />
      <h1>Your account has been suspended</h1>
      <p>
        For more info, contact{' '}
        <a href="mailto:anis000romzi@gmail.com" target="_blank">
          anis000romzi@gmail.com
        </a>
      </p>
    </main>
  );
}

export default Banned;
