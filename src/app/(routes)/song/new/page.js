'use client';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import { useState } from 'react';
import api from '@/app/_utils/api';
import Image from 'next/image';

function NewSong() {
  const authUser = useSelector((states) => states.authUser);
  const [title, onTitleChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [genre, onGenreChange] = useInput('');
  const [album, onAlbumChange] = useInput(null);
  const [file, setFile] = useState(null);
  const router = useRouter();

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

      const { songId } = await api.createSong({ title, year, genre, albumId });
      await api.addSongAudio(songId, file);

      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main>
      <h1>New Song Page</h1>
      <form>
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
          {authUser.albums.map((album) => (
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
