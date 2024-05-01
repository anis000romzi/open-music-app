import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useInput from '@/app/_hooks/useInput';
import defaultImage from '../../_assets/default-image.png';
import styles from '../../_styles/album.module.css';

function EditableAlbumItem({ id, year, name, cover, changeCover, editAlbum }) {
  const [edit, setEdit] = useState(false);
  const [nameInput, onNameChange] = useInput(name);
  const [yearInput, onYearChange] = useInput(year);

  return (
    <div className={styles.editable_album_item}>
      <div className={styles.edit_image}>
        <label htmlFor={`cover-${id}`}>
          <Image
            className=""
            src={cover ? cover : defaultImage}
            width={60}
            height={60}
            alt="Album cover"
            priority
          />
        </label>
        <input
          style={{ display: 'none' }}
          type="file"
          id={`cover-${id}`}
          name={`cover-${id}`}
          onChange={(event) => changeCover(id, event.target.files[0])}
        />
      </div>
      {edit ? (
        <form>
          <input
            type="text"
            value={nameInput}
            onChange={onNameChange}
            placeholder="Album Name"
          />
          <input
            type="text"
            value={yearInput}
            onChange={onYearChange}
            placeholder="Year"
          />
          <button
            type="button"
            onClick={() => {
              editAlbum({ id, name: nameInput, year: yearInput });
              setEdit(false);
            }}
          >
            Save
          </button>
        </form>
      ) : (
        <div>
          <Link href={`/profile/me/albums/${id}`}>
            <p>{name}</p>
            <em>{year}</em>
          </Link>
        </div>
      )}
      <button type="button" onClick={() => setEdit((current) => !current)}>
        {edit ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
}

export default EditableAlbumItem;
