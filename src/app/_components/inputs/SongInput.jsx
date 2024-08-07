import { useState } from 'react';
import useInput from '../../_hooks/useInput';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import Modal from '../Modal';
import { FileUploader } from 'react-drag-drop-files';
import { FaPen } from 'react-icons/fa6';
import { LuFileAudio } from 'react-icons/lu';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
import styles from '../../_styles/input.module.css';
import modalStyles from '../../_styles/modal.module.css';
import defaultImage from '../../_assets/default-image.png';

function SongInput({ creating, addSong, ownedAlbums, genres }) {
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [selectedGenre, onSelectedGenreChange] = useInput('');
  const [selectedAlbum, onSelectedAlbumChange] = useInput('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // image crop states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const selectedAlbumInfo = ownedAlbums.find(
    (album) => album.id === selectedAlbum
  );

  const openGenreModal = () => setIsGenreModalOpen(true);
  const closeGenreModal = () => setIsGenreModalOpen(false);
  const openAlbumModal = () => setIsAlbumModalOpen(true);
  const closeAlbumModal = () => setIsAlbumModalOpen(false);

  const handleAudioChange = (file) => {
    setAudio(file);
  };

  const handleCoverChange = (event) => {
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
      setCover(croppedImage);
      setImageSrc(null);
      setShowCropModal(false); // Hide the crop modal after cropping
    } catch (e) {
      console.error(e);
    }
  };

  if (audio) {
    const audioElement = new Audio(URL.createObjectURL(audio));
    audioElement.addEventListener('loadedmetadata', function () {
      const duration = audioElement.duration;
      setDuration(Math.floor(duration));
    });
  }

  return (
    <>
      <form className={styles.new_song_input}>
        <input
          type="file"
          id="cover"
          name="cover"
          style={{ display: 'none' }}
          onChange={handleCoverChange}
        />
        <label htmlFor="cover" className={styles.container}>
          <Image
            src={cover ? URL.createObjectURL(cover) : defaultImage}
            width={200}
            height={200}
            alt="Song cover"
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
              <button type="button" onClick={handleCrop}>
                Save
              </button>
              <button type="button" onClick={() => setShowCropModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.new_song_form}>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Song title"
          />
          <input
            type="number"
            value={year}
            onChange={onYearChange}
            placeholder="Year"
          />

          <button
            type="button"
            onClick={openGenreModal}
            className={styles.select_genre}
          >
            {selectedGenre === ''
              ? 'Select Genre'
              : genres.find((genre) => genre.id === selectedGenre).name}
          </button>
          <div className={styles.audio_input} htmlFor="audio">
            <FileUploader
              handleChange={handleAudioChange}
              types={['MP3', 'OGG', 'WAV', 'OPUS']}
            >
              <div className={styles.audio_input_label} htmlFor="audio">
                <span>
                  <LuFileAudio />{' '}
                  {audio ? audio.name : 'Choose audio file (max 100mb)'}
                </span>
              </div>
            </FileUploader>
          </div>
          <button
            type="button"
            onClick={openAlbumModal}
            className={styles.select_album}
          >
            {selectedAlbum === '' ? (
              'Single'
            ) : (
              <>
                <Image
                  src={
                    selectedAlbumInfo?.cover
                      ? selectedAlbumInfo?.cover
                      : defaultImage
                  }
                  width={50}
                  height={50}
                  alt="Album cover"
                />
                <div>
                  <p>{selectedAlbumInfo?.name}</p>
                  <p>{selectedAlbumInfo?.year}</p>
                </div>
              </>
            )}
          </button>
          <button
            type="submit"
            onClick={
              creating
                ? null
                : (event) => {
                    event.preventDefault();
                    addSong({
                      title,
                      year,
                      genre: selectedGenre,
                      duration,
                      albumId: selectedAlbum || null,
                      audio,
                      cover,
                    });
                  }
            }
            className={styles.create_song}
          >
            {creating ? 'Creating...' : 'Create Song'}
          </button>
        </div>
      </form>

      <Modal isModalOpen={isGenreModalOpen} onClose={closeGenreModal}>
        <div className={modalStyles.modal_body}>
          <div className={modalStyles.genre_list}>
            {genres.map((genre) => (
              <div key={genre.id} className={modalStyles.genre_item}>
                <input
                  id={genre.id}
                  type="radio"
                  value={genre.id}
                  onChange={onSelectedGenreChange}
                  checked={selectedGenre === genre.id}
                />
                <label htmlFor={genre.id}>{genre.name}</label>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal isModalOpen={isAlbumModalOpen} onClose={closeAlbumModal}>
        <div className={modalStyles.modal_body}>
          <div className={modalStyles.album_list}>
            <div className={modalStyles.album_item}>
              <input
                id="single"
                type="radio"
                value={''}
                onChange={onSelectedAlbumChange}
                checked={selectedAlbum === ''}
              />
              <label htmlFor="single">
                <p>Single</p>
              </label>
            </div>
            {ownedAlbums.map((album) => (
              <div key={album.id} className={modalStyles.album_item}>
                <input
                  id={album.id}
                  type="radio"
                  value={album.id}
                  onChange={onSelectedAlbumChange}
                  checked={selectedAlbum === album.id}
                />
                <label htmlFor={album.id}>
                  <Image
                    src={album.cover ? album.cover : defaultImage}
                    width={50}
                    height={50}
                    alt="Album cover"
                  />
                  <p>{album.name}</p>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SongInput;
