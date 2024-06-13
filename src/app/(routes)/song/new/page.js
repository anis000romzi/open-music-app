'use client';
// hooks
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import useInput from '@/app/_hooks/useInput';

// components
import Image from 'next/image';
import Modal from '@/app/_components/Modal';

// utils
import api from '@/app/_utils/api';

// icons
import { FaPen } from 'react-icons/fa6';
import { LuFileAudio } from 'react-icons/lu';

// styles
import styles from '../../../_styles/style.module.css';
import inputStyles from '../../../_styles/input.module.css';
import modalStyles from '../../../_styles/modal.module.css';

// assets
import defaultImage from '../../../_assets/default-image.png';

function NewSong() {
  const router = useRouter();
  const authUser = useSelector((state) => state.authUser);
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [selectedGenre, onSelectedGenreChange] = useInput('');
  const [selectedAlbum, onSelectedAlbumChange] = useInput('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [ownedAlbums, setOwnedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  const selectedAlbumInfo = ownedAlbums.find((album) => album.id === selectedAlbum);

  useEffect(() => {
    const fetchData = async () => {
      const albums = await api.getAlbumsByArtist(authUser.id);
      const genres = await api.getGenres();
      setOwnedAlbums(albums);
      setGenres(genres);
    };

    fetchData();
  }, [authUser.id]);

  if (!authUser || !authUser.is_active) {
    redirect('/');
    return null;
  }

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

  const addSong = async ({ title, year, genre, albumId }) => {
    try {
      if (!audio) {
        throw new Error('Audio cannot be empty');
      }

      if (audio.size > 51200000) {
        throw new Error('Audio is too big');
      }

      const { songId } = await api.createSong({ title, year, genre, albumId });
      await api.addSongAudio(songId, audio);

      if (cover) {
        await api.addSongCover(songId, cover);
      }

      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <main className={styles.new_song_page}>
        <h1>New Song</h1>
        <form className={inputStyles.new_song_input}>
          <input
            type="file"
            id="cover"
            name="cover"
            style={{ display: 'none' }}
            onChange={handleCoverChange}
          />
          <label htmlFor="cover" className={inputStyles.container}>
            <Image
              src={cover ? URL.createObjectURL(cover) : defaultImage}
              width={200}
              height={200}
              alt="Song cover"
            />
            <div className={inputStyles.overlay}>
              <div className={inputStyles.text}>
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
              className={inputStyles.select_genre}
            >
              {selectedGenre === '' ? 'Select Genre' : genres.find((genre) => genre.id === selectedGenre).name}
            </button>
            <input
              type="file"
              id="audio"
              name="audio"
              style={{ display: 'none' }}
              onChange={handleAudioChange}
              accept=".mp3, .ogg, .wav, .opus, .aac|audio/*"
            />
            <label className={inputStyles.audio_input} htmlFor="audio">
              <LuFileAudio /> {audio ? audio.name : 'Choose audio file'}
            </label>
            <button
              type="button"
              onClick={openAlbumModal}
              className={inputStyles.select_album}
            >
              {selectedAlbum === '' ? 'Single' : (
                <>
                <Image
                  src={selectedAlbumInfo.cover ? selectedAlbumInfo.cover : defaultImage}
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
                addSong({ title, year, genre: selectedGenre, albumId: selectedAlbum })
              }
              className={inputStyles.create_song}
            >
              Create Song
            </button>
          </div>
        </form>
      </main>

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
                  <p>
                    {album.name}
                  </p>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default NewSong;
