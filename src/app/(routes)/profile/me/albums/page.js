'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditableAlbumsList from '@/app/_components/albums/EditableAlbumsList';
import Cropper from 'react-easy-crop';
import {
  asyncGetOwnedAlbums,
  asyncEditAlbum,
  asyncDeleteAlbum,
  asyncChangeCoverAlbums,
} from '@/app/_states/albums/action';
import { redirect } from 'next/navigation';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
import styles from '../../../../_styles/style.module.css';

function EditAlbums() {
  const dispatch = useDispatch();
  const albums = useSelector((states) => states.albums);
  const authUser = useSelector((states) => states.authUser);

  const [albumId, setAlbumId] = useState(null);
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
    dispatch(asyncGetOwnedAlbums());
  }, [dispatch]);

  const changeCoverAlbum = (id, file) => {
    // dispatch(asyncChangeCoverAlbums(id, file));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAlbumId(id);
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
      dispatch(asyncChangeCoverAlbums(albumId, croppedImage));
      setAlbumId(null);
      setImageSrc(null);
      setShowCropModal(false); // Hide the crop modal after cropping
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, imageSrc, croppedAreaPixels, albumId]);

  const editAlbum = ({ id, name, year }) => {
    dispatch(asyncEditAlbum({ id, name, year }));
  };

  const deleteAlbum = (id) => {
    dispatch(asyncDeleteAlbum(id));
  };

  return (
    <main>
      {albums && (
        <EditableAlbumsList
          albums={albums}
          changeCover={changeCoverAlbum}
          editAlbum={editAlbum}
          deleteAlbum={deleteAlbum}
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

export default EditAlbums;
