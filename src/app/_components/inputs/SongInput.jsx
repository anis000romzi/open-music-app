import { useState } from 'react';
import useInput from '../../_hooks/useInput';
import Image from 'next/image';
import Modal from '../Modal';
import { FaPen } from 'react-icons/fa6';
import { LuFileAudio } from 'react-icons/lu';
import styles from '../../_styles/input.module.css';
import modalStyles from '../../_styles/modal.module.css';
import defaultImage from '../../_assets/default-image.png';

function SongInput({ addSong, ownedAlbums, genres }) {
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [selectedGenre, onSelectedGenreChange] = useInput('');
  const [selectedAlbum, onSelectedAlbumChange] = useInput('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  const selectedAlbumInfo = ownedAlbums.find(
    (album) => album.id === selectedAlbum
  );

  const openGenreModal = () => setIsGenreModalOpen(true);
  const closeGenreModal = () => setIsGenreModalOpen(false);
  const openAlbumModal = () => setIsAlbumModalOpen(true);
  const closeAlbumModal = () => setIsAlbumModalOpen(false);

  const handleAudioChange = (event) => {
    if (event.target.files) {
      setAudio(event.target.files[0]);
    }
  };

  const handleCoverChange = (event) => {
    if (event.target.files) {
      setCover(event.target.files[0]);
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
          />
          <div className={styles.overlay}>
            <div className={styles.text}>
              <FaPen />
            </div>
          </div>
        </label>
        <div>
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
          <input
            type="file"
            id="audio"
            name="audio"
            style={{ display: 'none' }}
            onChange={handleAudioChange}
            accept=".mp3, .ogg, .wav, .opus, .aac|audio/*"
          />
          <label className={styles.audio_input} htmlFor="audio">
            <LuFileAudio /> {audio ? audio.name : 'Choose audio file'}
          </label>
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
                    selectedAlbumInfo.cover
                      ? selectedAlbumInfo.cover
                      : defaultImage
                  }
                  width={50}
                  height={50}
                  alt="Album cover"
                />
                <div>
                  <p>{selectedAlbumInfo.name}</p>
                  <p>{selectedAlbumInfo.year}</p>
                </div>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              addSong({
                title,
                year,
                genre: selectedGenre,
                duration,
                albumId: selectedAlbum,
                audio,
                cover,
              })
            }
            className={styles.create_song}
          >
            Create Song
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
