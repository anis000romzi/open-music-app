'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditableSongsList from '@/app/_components/songs/EditableSongsList';
import Cropper from 'react-easy-crop';
import {
  asyncGetOwnedSongs,
  asyncEditSong,
  asyncDeleteSong,
  asyncChangeCoverSongs,
} from '@/app/_states/songs/action';
import { asyncGetOwnedAlbums } from '@/app/_states/albums/action';
import { redirect } from 'next/navigation';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
import api from '@/app/_utils/api';
import styles from '../../../../_styles/style.module.css';

function EditSongs() {
  const dispatch = useDispatch();
  const songs = useSelector((states) => states.songs);
  const albums = useSelector((states) => states.albums);
  const authUser = useSelector((states) => states.authUser);

  const [genres, setGenres] = useState([]);
  const [songId, setSongId] = useState(null);
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
    const fetchData = async () => {
      const genres = await api.getGenres();

      setGenres(genres);
    };

    fetchData();
    dispatch(asyncGetOwnedAlbums());
    dispatch(asyncGetOwnedSongs());
  }, [dispatch, authUser.id]);

  const changeCoverSong = (id, file) => {
    // dispatch(asyncChangeCoverSongs(id, file));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSongId(id);
        setImageSrc(reader.result);
        setShowCropModal(true); // Show the crop modal when an image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      dispatch(asyncChangeCoverSongs(songId, croppedImage));
      setSongId(null);
      setImageSrc(null);
      setShowCropModal(false); // Hide the crop modal after cropping
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, imageSrc, croppedAreaPixels, songId]);

  const editSong = ({
    id,
    title,
    year,
    genre,
    genre_id,
    duration,
    album,
    album_id,
  }) => {
    dispatch(
      asyncEditSong({
        id,
        title,
        year,
        genre,
        genre_id,
        duration,
        album,
        album_id,
      })
    );
  };

  const deleteSong = (id) => {
    dispatch(asyncDeleteSong(id));
  };

  return (
    <main>
      {songs && (
        <EditableSongsList
          songs={songs}
          changeCover={changeCoverSong}
          editSong={editSong}
          deleteSong={deleteSong}
          albumsOption={albums}
          genresOption={genres}
        />
      )}

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
    </main>
  );
}

export default EditSongs;
