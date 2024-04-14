'use client';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import { useState } from 'react';
import api from '@/app/_utils/api';
import styles from '../../../_styles/input.module.css';
import Image from 'next/image';
import defaultImage from '../../../_assets/default-image.png';

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
      if (file) {
        if (file.size > 512000) {
          throw new Error('File is too big');
        }
      }

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
      <form className={styles.new_album_input}>
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
        <Image
          src={file ? URL.createObjectURL(file) : defaultImage}
          width={200}
          height={200}
          alt="Album cover"
        />
        <button type="button" onClick={() => addAlbum({ name, year, file })}>
          Create Album
        </button>
      </form>
    </main>
  );
}

export default NewAlbumm;
