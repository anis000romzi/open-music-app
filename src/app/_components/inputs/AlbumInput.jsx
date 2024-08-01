import { useState } from 'react';
import useInput from '../../_hooks/useInput';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa6';
import styles from '../../_styles/input.module.css';
import defaultImage from '../../_assets/default-image.png';

function AlbumInput({ creating, addAlbum }) {
  const [name, onNameChange] = useInput('');
  const [year, onYearChange] = useInput('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <form className={styles.new_album_input}>
      <input
        type="file"
        id="cover"
        name="cover"
        style={{ display: 'none' }}
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
        <button type="submit" onClick={creating ? null : (event) => {
          event.preventDefault();
          addAlbum(name, year, file)
        }}>
          {creating ? 'Creating...' : 'Create Album'}
        </button>
      </div>
    </form>
  );
}

export default AlbumInput;
