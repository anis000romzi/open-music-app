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
  const [fullname, onFullnameChange] = useInput(
    authUser ? authUser.fullname : ''
  );
  const [description, onDescriptionChange] = useInput(
    authUser ? authUser.description : ''
  );

  const editUser = ({ id, fullname, description }) => {
    dispatch(asyncEditAuthUser({ id, fullname, description }));
  };

  const changePictureUser = (id, file) => {
    dispatch(asyncChangePictureAuthUser(id, file));
  };

  return (
    <main className={styles.main}>
      {authUser && (
        <>
          <Image
            src={authUser.picture}
            width={100}
            height={100}
            alt="Profile picture"
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
            <div>
              <h1>{authUser.fullname}</h1>
              <em>@{authUser.username}</em>
              <br />
              <em>email: {authUser.email}</em>
              <p>
                {authUser.description ? authUser.description : 'No description'}
              </p>
            </div>
          )}
          <button type="button" onClick={() => setEdit((current) => !current)}>
            {edit ? 'Cancel' : 'Edit'}
          </button>
        </>
      )}
    </main>
  );
}

export default Profile;
