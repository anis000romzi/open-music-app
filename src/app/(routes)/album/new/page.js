'use client';
// hooks
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';

// components
import Image from 'next/image';

// utils
import api from '@/app/_utils/api';

// icons 
import { FaPen } from 'react-icons/fa6';

// styles
import inputStyles from '../../../_styles/input.module.css';
import styles from '../../../_styles/style.module.css';

// assets
import defaultImage from '../../../_assets/default-image.png';

function NewAlbum() {
  const router = useRouter();

  const authUser = useSelector((state) => state.authUser);

  const [name, onNameChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [file, setFile] = useState(null);

  if (!authUser || !authUser.is_active) {
    router.push('/');
    return null;
  }

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const addAlbum = async () => {
    try {
      if (file && file.size > 512000) {
        throw new Error('File is too big');
      }

      const { albumId } = await api.createAlbum(name, year);
      if (file) {
        await api.addAlbumCover(albumId, file);
      }

      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className={styles.new_album_page}>
      <h1>New Album</h1>
      <form className={inputStyles.new_album_input}>
        <input
          type="file"
          id="cover"
          name="cover"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="cover" className={inputStyles.container}>
          <Image
            src={file ? URL.createObjectURL(file) : defaultImage}
            width={200}
            height={200}
            alt="Album cover"
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
          <button type="button" onClick={addAlbum}>
            Create Album
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewAlbum;
