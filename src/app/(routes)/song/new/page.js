'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import { AiOutlineEdit } from 'react-icons/ai';
import useInput from '@/app/_hooks/useInput';
import Image from 'next/image';
import api from '@/app/_utils/api';
import defaultImage from '../../../_assets/default-image.png';
import styles from '../../../_styles/input.module.css';

function NewSong() {
  const authUser = useSelector((states) => states.authUser);
  const router = useRouter();
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [genre, onGenreChange] = useInput('');
  const [album, onAlbumChange] = useInput(null);
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [ownedAlbums, setOwnedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);

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
  }

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
      if (!file) {
        throw new Error('File cannot be empty');
      }

      if (file.size > 51200000) {
        throw new Error('File is too big');
      }

      const { songId } = await api.createSong({ title, year, genre, albumId });
      await api.addSongAudio(songId, file);

      if (cover) {
        await api.addSongCover(songId, cover);
      }

      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main>
      <form className={styles.new_song_input}>
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
        <select id="genre" name="genre" onChange={onGenreChange}>
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <input
          style={{ display: 'none' }}
          type="file"
          id="audio"
          name="audio"
          onChange={handleAudioChange}
        />
        <label htmlFor="audio">
          {audio ? audio.name : 'Choose audio file'}
        </label>
        <input
          style={{ display: 'none' }}
          type="file"
          id="cover"
          name="cover"
          onChange={handleCoverChange}
        />
        <label htmlFor="cover" className={styles.container}>
          <Image
            src={cover ? URL.createObjectURL(cover) : defaultImage}
            width={200}
            height={200}
            alt="Album cover"
          />
          <div className={styles.overlay}>
            <div className={styles.text}>
              <AiOutlineEdit />
            </div>
          </div>
        </label>
        <label htmlFor="album">Insert to album</label>
        <select id="album" name="album" onChange={onAlbumChange}>
          <option value={null}>Single</option>
          {ownedAlbums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => addSong({ title, year, genre, albumId: album })}
        >
          Create Song
        </button>
      </form>
    </main>
  );
}

export default NewSong;
