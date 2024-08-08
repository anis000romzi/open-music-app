import { useState } from 'react';
import useInput from '../../_hooks/useInput';
import Cropper from 'react-easy-crop';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa6';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
import styles from '../../_styles/input.module.css';
import defaultImage from '../../_assets/default-image.png';

function AlbumInput({ creating, addAlbum }) {
  const [name, onNameChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [file, setFile] = useState(null);

  // image crop states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true); // Show the crop modal when an image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setFile(croppedImage);
      setImageSrc(null);
      setShowCropModal(false); // Hide the crop modal after cropping
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={styles.new_album_input}>
      <input
        type="file"
        id="cover"
        name="cover"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="cover" className={styles.container}>
        <Image
          src={file ? URL.createObjectURL(file) : defaultImage}
          width={200}
          height={200}
          alt="Album cover"
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
            <button type="button" onClick={handleCrop}>Save</button>
            <button type="button" onClick={() => setShowCropModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.new_album_form}>
        <input
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Album name"
        />
        <input
          type="number"
          value={year}
          onChange={onYearChange}
          placeholder="Year"
        />
        <button type="submit" onClick={creating ? null : (event) => {
          event.preventDefault();
          addAlbum(name, year, file)
        }}>
          {creating ? 'Creating...' : 'Create Album'}
        </button>
      </div>
    </form>
  );
}

export default AlbumInput;
