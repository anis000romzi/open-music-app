'use client';
// hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';

// components
import Image from 'next/image';
import Link from 'next/link';

// redux actions
import {
  asyncEditAuthUser,
  asyncChangePictureAuthUser,
} from '@/app/_states/authUser/action';
import { asyncGetOwnedSongs } from '@/app/_states/songs/action';
import { asyncGetOwnedAlbums } from '@/app/_states/albums/action';

//utils
import { redirect } from 'next/navigation';

// icons
import { FaPen } from 'react-icons/fa6';
import { FaChartSimple } from 'react-icons/fa6';

//styles
import styles from '../../../_styles/style.module.css';

function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const albums = useSelector((state) => state.albums);
  const songs = useSelector((state) => state.songs);
  const [edit, setEdit] = useState(false);
  const [fullname, onFullnameChange] = useInput(authUser?.fullname || '');
  const [description, onDescriptionChange] = useInput(
    authUser?.description || ''
  );

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  useEffect(() => {
    dispatch(asyncGetOwnedSongs());
    dispatch(asyncGetOwnedAlbums());
  }, [dispatch]);

  const handleEditUser = () => {
    dispatch(asyncEditAuthUser({ id: authUser.id, fullname, description }));
    setEdit(false);
  };

  const handleChangePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(asyncChangePictureAuthUser(authUser.id, file));
    }
  };

  return (
    <main className={styles.profile_page}>
      <input
        style={{ display: 'none' }}
        type="file"
        id="picture"
        name="picture"
        onChange={handleChangePicture}
      />
      <label htmlFor="picture" className={styles.container}>
        <Image
          className={styles.profile_picture}
          src={authUser.picture}
          width={150}
          height={150}
          alt="Profile picture"
          priority
        />
        <div className={styles.overlay}>
          <div className={styles.text}>
            <FaPen />
          </div>
        </div>
      </label>
      {edit ? (
        <form className={styles.edit_profile_input}>
          <input
            type="text"
            value={fullname}
            onChange={onFullnameChange}
            placeholder="Fullname"
          />
          <textarea
            value={description}
            onChange={onDescriptionChange}
            placeholder="Description"
          />
          <button type="button" onClick={handleEditUser}>
            Save
          </button>
        </form>
      ) : (
        <div className={styles.profile_info}>
          <div className={styles.profile_info__name}>
            <h1>{authUser.fullname}</h1>
            <span>@{authUser.username}</span>
            <span>{authUser.email}</span>
          </div>
          <div className={styles.profile_info__description}>
            <h2>Description</h2>
            <p>{authUser.description || 'No description'}</p>
          </div>
        </div>
      )}
      <button
        className={`${styles.edit_button} ${edit ? styles.active : ''}`}
        type="button"
        onClick={() => setEdit(!edit)}
      >
        {edit ? 'Cancel' : 'Edit'}
      </button>
      <div className={styles.contents}>
        <Link href="/profile/me/albums">
          <div>
            <p>Albums</p> <span>{albums?.length}</span>
          </div>
        </Link>
        <Link href="/profile/me/songs">
          <div>
            <p>Songs</p> <span>{songs?.length}</span>
          </div>
        </Link>
      </div>
      {/* <div className={styles.statistics}>
        <div>
          <FaChartSimple />
          <h2>Statistics</h2>
        </div>
      </div> */}
    </main>
  );
}

export default Profile;
