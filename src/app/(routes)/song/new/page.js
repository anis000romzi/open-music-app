'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import api from '@/app/_utils/api';
import styles from '../../../_styles/input.module.css';

function NewSong() {
  const authUser = useSelector((states) => states.authUser);
  const router = useRouter();
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [genre, onGenreChange] = useInput('');
  const [album, onAlbumChange] = useInput(null);
  const [file, setFile] = useState(null);
  const [ownedAlbum, setOwnedAlbum] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const albums = await api.getAlbumsByArtist(authUser.id);
      setOwnedAlbum(albums);
    };

    fetchData();
  }, [authUser.id]);

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
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
        <input
          type="text"
          value={genre}
          onChange={onGenreChange}
          placeholder="Song genre"
        />
        <input
          type="file"
          id="cover"
          name="cover"
          onChange={handleFileChange}
        />
        <label htmlFor="album">Insert to album</label>
        <select id="album" name="album" onChange={onAlbumChange}>
          <option value="">Single</option>
          {ownedAlbum.map((album) => (
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
