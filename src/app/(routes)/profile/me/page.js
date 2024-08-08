'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import Image from 'next/image';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import {
  asyncEditAuthUser,
  asyncChangePictureAuthUser,
} from '@/app/_states/authUser/action';
import { asyncGetOwnedSongs } from '@/app/_states/songs/action';
import { asyncGetOwnedAlbums } from '@/app/_states/albums/action';
import { redirect } from 'next/navigation';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
import { FaPen, FaChartSimple } from 'react-icons/fa6';
import { FaRegEye } from "react-icons/fa";
import styles from '../../../_styles/style.module.css';

function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const albums = useSelector((state) => state.albums);
  const songs = useSelector((state) => state.songs);
  const [edit, setEdit] = useState(false);
  const [fullname, onFullnameChange] = useInput(authUser?.fullname || '');
  const [username, onUsernameChange] = useInput(authUser?.username || '');
  const [description, onDescriptionChange] = useInput(authUser?.description || '');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  useEffect(() => {
    dispatch(asyncGetOwnedSongs());
    dispatch(asyncGetOwnedAlbums());
  }, [dispatch]);

  const handleEditUser = useCallback(() => {
    dispatch(asyncEditAuthUser({ id: authUser.id, fullname, username, description }));
    setEdit(false);
  }, [dispatch, authUser.id, fullname, username, description]);

  const handleChangePicture = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true); // Show the crop modal when an image is selected
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      dispatch(asyncChangePictureAuthUser(authUser.id, croppedImage));
      setImageSrc(null);
      setShowCropModal(false); // Hide the crop modal after cropping
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, imageSrc, croppedAreaPixels, authUser.id]);

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

      {showCropModal && (
        <div className={styles.crop_modal}>
          <div className={styles.crop_modal_content}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className={styles.crop_buttons}>
            <button onClick={handleCrop}>Save</button>
            <button onClick={() => setShowCropModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {edit ? (
        <form className={styles.edit_profile_input}>
          <input
            type="text"
            value={fullname}
            onChange={onFullnameChange}
            placeholder="Fullname"
          />
          <input
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="Username"
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
      <Link className={styles.preview_profile_page} href={`/artist/${authUser?.id}`}>View profile <FaRegEye /></Link>
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
      <div className={styles.statistics}>
        <div>
          <h2>
            <FaChartSimple /> Statistics
          </h2>
          <span>{authUser.followers.length} followers</span>
          <span>{authUser.listenedCount} total listeners</span>
          <span>{authUser.likedCount} total likes</span>
        </div>
      </div>
    </main>
  );
}

export default Profile;
