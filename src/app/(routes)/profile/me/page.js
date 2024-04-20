'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncEditAuthUser,
  asyncChangePictureAuthUser,
} from '@/app/_states/authUser/action';
import Image from 'next/image';
import useInput from '@/app/_hooks/useInput';
import styles from '../../../_styles/style.module.css';

function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const [edit, setEdit] = useState(false);
  const [fullname, onFullnameChange] = useInput(authUser ? authUser.fullname : '');
  const [description, onDescriptionChange] = useInput(authUser ? authUser.description : '');
  // const [description, setDescription] = useState(authUser ? authUser.description : '');

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  // const onInputDescription = ({ target }) => {
  //   setDescription(target.innerHTML);
  // };

  const editUser = ({ id, fullname, description }) => {
    dispatch(asyncEditAuthUser({ id, fullname, description }));
  };

  const changePictureUser = (id, file) => {
    dispatch(asyncChangePictureAuthUser(id, file));
  };

  return (
    <main className={styles.profile_page}>
      {authUser && (
        <>
          <Image
            className={styles.profile_picture}
            src={authUser.picture}
            width={100}
            height={100}
            alt="Profile picture"
            priority
          />
          {edit ? (
            <form>
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={(event) =>
                  changePictureUser(authUser.id, event.target.files[0])
                }
              />
              <input
                type="text"
                value={fullname}
                onChange={onFullnameChange}
                placeholder="Fullname"
              />
              {/* <div
                data-placeholder="Write your note here ..."
                contentEditable
                onInput={onInputDescription}
              >{description}</div> */}
              <textarea
                value={description}
                onChange={onDescriptionChange}
                placeholder="Description"
              ></textarea>
              <button
                type="button"
                onClick={() => {
                  editUser({ id: authUser.id, fullname, description });
                  setEdit(false);
                }}
              >
                Save
              </button>
            </form>
          ) : (
            <div className={styles.profile_info}>
              <div className={styles.profile_info__name}>
                <h1>{authUser.fullname}</h1>
                <em>@{authUser.username}</em>
              </div>
              <p className={styles.profile_info__description}>
                {authUser.description ? authUser.description : 'No description'}
              </p>
              <span>email: {authUser.email}</span>
            </div>
          )}
          <button
            className={`${styles.edit_button} ${edit ? styles.active : ''}`}
            type="button"
            onClick={() => setEdit((current) => !current)}
          >
            {edit ? 'Cancel' : 'Edit'}
          </button>
        </>
      )}
    </main>
  );
}

export default Profile;
