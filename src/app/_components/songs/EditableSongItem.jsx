import { useState } from 'react';
import Image from 'next/image';
import useInput from '@/app/_hooks/useInput';
import defaultImage from '../../_assets/default-image.png';

function EditableSongItem({
  id,
  title,
  year,
  cover,
  album,
  album_id,
  genre,
  genre_id,
  duration,
  changeCover,
  editSong,
  albumsOption,
  genresOption,
}) {
  const [edit, setEdit] = useState(false);
  const [titleInput, onTitleChange] = useInput(title);
  const [yearInput, onYearChange] = useInput(year);
  const [genreInput, onGenreChange, setGenreInput] = useInput(
    genre ? { genre_id, genre } : { genre_id: '', genre: '' }
  );
  const [albumInput, onAlbumChange, setAlbumInput] = useInput(
    album ? { album_id, album } : { album_id: '', album: '' }
  );

  return (
    <div>
      <div>
        <label htmlFor={`cover-${id}`}>
          <Image
            src={cover ? cover : defaultImage}
            width={50}
            height={50}
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
            value={titleInput}
            onChange={onTitleChange}
            placeholder="Song Title"
          />
          <select
            value={albumInput.album_id}
            id="album"
            name="album"
            onChange={({ target }) =>
              setAlbumInput({
                album_id: target.value,
                album: target.selectedOptions[0].text,
              })
            }
          >
            <option value="">Single</option>
            {albumsOption.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={yearInput}
            onChange={onYearChange}
            placeholder="Year"
          />
          <select
            value={genreInput.genre_id}
            id="genre"
            name="genre"
            onChange={({ target }) =>
              setGenreInput({
                genre_id: target.value,
                genre: target.selectedOptions[0].text,
              })
            }
          >
            <option value="">Select Genre</option>
            {genresOption.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              editSong({
                id,
                title: titleInput,
                year: yearInput,
                genre: genreInput.genre,
                genre_id: genreInput.genre_id,
                duration,
                album: albumInput.album,
                album_id: albumInput.album_id,
              });
              setEdit(false);
            }}
          >
            Save
          </button>
        </form>
      ) : (
        <div>
          <strong>
            {title} | {album ? album : 'Single'}
          </strong>
          <p>{genre}</p>
          <p>{year}</p>
        </div>
      )}
      <button type="button" onClick={() => setEdit((current) => !current)}>
        {edit ? 'Cancel' : 'Edit'}
      </button>
      <button type="button" onClick={() => {}}>
        Delete
      </button>
    </div>
  );
}

export default EditableSongItem;
