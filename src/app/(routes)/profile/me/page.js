'use client';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../../_styles/style.module.css';
import Image from 'next/image';

function Profile() {
  const authUser = useSelector((states) => states.authUser);

  return (
    <main className={styles.main}>
      {authUser && (
        <>
          <Image
            src={authUser.picture}
            width={70}
            height={70}
            alt="Profile picture"
          />
          <h1>{authUser.fullname}</h1>
          <em>@{authUser.username}</em>
          <em>email: {authUser.email}</em>
          <p>
            {authUser.description ? authUser.description : 'No description'}
          </p>
        </>
      )}
    </main>
  );
}

export default Profile;
