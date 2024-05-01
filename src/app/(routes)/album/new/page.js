'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiOutlineEdit } from 'react-icons/ai';
import api from '@/app/_utils/api';
import useInput from '@/app/_hooks/useInput';
import styles from '../../../_styles/input.module.css';
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
          style={{ display: 'none' }}
          type="file"
          id="cover"
          name="cover"
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
              <AiOutlineEdit />
            </div>
          </div>
        </label>
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
        <button type="button" onClick={() => addAlbum({ name, year, file })}>
          Create Album
        </button>
      </form>
    </main>
  );
}

export default NewAlbumm;
