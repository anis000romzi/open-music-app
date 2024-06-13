import { useState, useCallback, useMemo } from 'react';
import useInput from '@/app/_hooks/useInput';
import DataTable, { createTheme } from 'react-data-table-component';
import Image from 'next/image';
import Link from 'next/link';
import Modal from '../Modal';
import { FaPen, FaRegTrashCan } from 'react-icons/fa6';
import styles from '../../_styles/album.module.css';
import modalStyles from '../../_styles/modal.module.css';
import defaultImage from '../../_assets/default-image.png';

createTheme('musictheme', {
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
}, 'dark');

const EditableAlbumsList = ({ albums, changeCover, editAlbum, deleteAlbum }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [albumEdit, setAlbumEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, onNameChange, setNameInput] = useInput('');
  const [yearInput, onYearChange, setYearInput] = useInput('');

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map((r) => r.name)}?`)) {
      setToggleCleared(!toggleCleared);
      selectedRows.forEach((r) => deleteAlbum(r.id));
    }
  }, [deleteAlbum, selectedRows, toggleCleared]);

  const contextActions = useMemo(() => (
    <button
      type="button"
      className={styles.delete_album}
      onClick={handleDelete}
    >
      Delete
    </button>
  ), [handleDelete]);

  const columns = useMemo(() => [
    {
      name: 'Cover',
      selector: (row) => row.cover,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
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
  ], []);

  const filteredAlbums = useMemo(() => albums.map((album) => ({
    id: album.id,
    cover: (
      <div className={styles.edit_image}>
        <label htmlFor={`cover-${album.id}`}>
          <Image
            src={album.cover || defaultImage}
            width={60}
            height={60}
            alt="Album cover"
            priority
          />
        </label>
        <input
          style={{ display: 'none' }}
          type="file"
          id={`cover-${album.id}`}
          name={`cover-${album.id}`}
          onChange={(event) => changeCover(album.id, event.target.files[0])}
        />
      </div>
    ),
    name: (
      <Link href={`/profile/me/albums/${album.id}`} className={styles.album_link}>
        {album.name}
      </Link>
    ),
    year: album.year,
    actions: (
      <div className={styles.actions_buttons}>
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setAlbumEdit(album);
            setNameInput(album.name);
            setYearInput(album.year);
          }}
        >
          <FaPen />
        </button>
        <button type="button" onClick={() => {
          if (window.confirm('Are you sure you want to delete this album?')) {
            deleteAlbum(album.id)
          }
        }}>
          <FaRegTrashCan />
        </button>
      </div>
    ),
  })), [albums, changeCover, setNameInput, setYearInput, deleteAlbum]);

  return (
    <>
      <div className={styles.editable_album_list}>
        <DataTable
          title={`Your Albums: ${albums.length} albums`}
          columns={columns}
          data={filteredAlbums}
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
          <strong>Edit Album</strong>
        </div>
        <div className={modalStyles.modal_body}>
          <form className={modalStyles.edit_album_input}>
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
                editAlbum({ id: albumEdit.id, name: nameInput, year: yearInput });
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
};

export default EditableAlbumsList;
