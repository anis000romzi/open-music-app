'use client';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import { useState } from 'react';
import api from '@/app/_utils/api';

function NewAlbumm() {
  const authUser = useSelector((states) => states.authUser);
  const [name, onNameChange] = useInput('');
  const [year, onYearChange] = useInput('');
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

  const addAlbum = async ({ name, year, file }) => {
    try {
      const { albumId } = await api.createAlbum(name, year);

      if (file) {
        await api.addAlbumCover(albumId, file);
      }

      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main>
      <h1>New Album Page</h1>
      <form>
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
        <input
          type="file"
          id="cover"
          name="cover"
          onChange={handleFileChange}
        />
        <button type="button" onClick={() => addAlbum({ name, year, file })}>
          Create Album
        </button>
      </form>
    </main>
  );
}

export default NewAlbumm;
