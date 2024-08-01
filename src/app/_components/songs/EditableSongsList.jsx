import { useState, useMemo, useCallback } from 'react';
import useInput from '@/app/_hooks/useInput';
import DataTable, { createTheme } from 'react-data-table-component';
import Image from 'next/image';
import Modal from '../Modal';
import { FaPen, FaRegTrashCan } from 'react-icons/fa6';
import styles from '../../_styles/song.module.css';
import modalStyles from '../../_styles/modal.module.css';
import defaultImage from '../../_assets/default-image.png';

createTheme(
  'musictheme',
  {
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
    background: {
      default: '#000000',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#303030',
    },
    sortFocus: {
      default: '#2aa198',
    },
  },
  'dark'
);

function EditableSongsList({
  songs,
  changeCover,
  editSong,
  deleteSong,
  albumsOption,
  genresOption,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [songEdit, setSongEdit] = useState('');
  const [titleInput, onTitleChange, setTitleInput] = useInput('');
  const [yearInput, onYearChange, setYearInput] = useInput('');
  const [genreInput, onGenreChange, setGenreInput] = useInput({});
  const [albumInput, onAlbumChange, setAlbumInput] = useInput({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map(
          (r) => r.title
        )}?`
      )
    ) {
      setToggleCleared(!toggleCleared);
      selectedRows.forEach((r) => deleteSong(r.id));
    }
  }, [deleteSong, selectedRows, toggleCleared]);

  const contextActions = useMemo(
    () => (
      <button
        type="button"
        className={styles.delete_song}
        onClick={handleDelete}
      >
        Delete
      </button>
    ),
    [handleDelete]
  );

  const columns = useMemo(
    () => [
      {
        name: 'Cover',
        selector: (row) => row.cover,
      },
      {
        name: 'Title',
        selector: (row) => row.title,
        sortable: true,
      },
      {
        name: 'Album',
        selector: (row) => row.album,
        sortable: true,
      },
      {
        name: 'Genre',
        selector: (row) => row.genre,
        sortable: true,
      },
      {
        name: 'Year',
        selector: (row) => row.year,
        sortable: true,
      },
      {
        name: '',
        selector: (row) => row.actions,
      },
    ],
    []
  );

  const filteredSongs = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(lowercasedQuery) ||
          song.album?.toLowerCase().includes(lowercasedQuery) ||
          song.genre.toLowerCase().includes(lowercasedQuery) ||
          song.year.toString().includes(lowercasedQuery)
      )
      .map((song) => ({
        id: song.id,
        cover: (
          <div className={styles.edit_image}>
            <label htmlFor={`cover-${song.id}`}>
              <Image
                src={song.cover || defaultImage}
                width={60}
                height={60}
                alt="Song cover"
                priority
              />
            </label>
            <input
              style={{ display: 'none' }}
              type="file"
              id={`cover-${song.id}`}
              name={`cover-${song.id}`}
              onChange={(event) => changeCover(song.id, event.target.files[0])}
            />
          </div>
        ),
        title: song.title,
        album: song.album || 'Single',
        genre: song.genre,
        year: song.year,
        actions: (
          <div className={styles.actions_buttons}>
            <button
              className={styles.edit_song_button}
              type="button"
              onClick={() => {
                setSongEdit(song);
                setTitleInput(song.title);
                setYearInput(song.year);
                setGenreInput({ genre_id: song.genre_id, genre: song.genre });
                setAlbumInput({ album_id: song.album_id, album: song.album });
                setIsModalOpen(true);
              }}
            >
              <FaPen />
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this song?')
                ) {
                  deleteSong(song.id);
                }
              }}
            >
              <FaRegTrashCan />
            </button>
          </div>
        ),
      }));
  }, [
    songs,
    changeCover,
    deleteSong,
    setTitleInput,
    setYearInput,
    setAlbumInput,
    setGenreInput,
    searchQuery,
  ]);

  return (
    <>
      <div className={styles.editable_song_list}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.search_input}
        />
        <DataTable
          title={`Your Songs: ${songs.length} songs`}
          columns={columns}
          data={filteredSongs}
          pagination
          selectableRows
          contextActions={selectedRows.length <= 1 ? '' : contextActions}
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          theme="musictheme"
        />
      </div>

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={modalStyles.modal_header}>
          <strong>Edit Song</strong>
        </div>
        <div className={modalStyles.modal_body}>
          <form className={modalStyles.edit_song_input}>
            <input
              type="text"
              value={titleInput}
              onChange={onTitleChange}
              placeholder="Song Title"
            />
            <input
              type="text"
              value={yearInput}
              onChange={onYearChange}
              placeholder="Year"
            />
            <select
              value={albumInput.album_id || ''}
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
            <select
              value={genreInput.genre_id || ''}
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
                  id: songEdit.id,
                  title: titleInput,
                  year: yearInput,
                  genre: genreInput.genre,
                  genre_id: genreInput.genre_id,
                  duration: songEdit.duration,
                  album: albumInput.album,
                  album_id: albumInput.album_id,
                });
                setIsModalOpen(false);
              }}
            >
              Save
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default EditableSongsList;
