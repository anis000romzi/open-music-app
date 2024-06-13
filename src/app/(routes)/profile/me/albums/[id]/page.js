'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Modal from '@/app/_components/Modal';
import DataTable, { createTheme } from 'react-data-table-component';
import {
  asyncReceiveAlbumDetail,
  asyncDeleteSongFromAlbum,
  asyncAddSongsToAlbum,
} from '@/app/_states/albumDetail/action';
import api from '@/app/_utils/api';
import { FaRegTrashCan } from "react-icons/fa6";
import styles from '../../../../../_styles/style.module.css';
import modalStyles from '../../../../../_styles/modal.module.css';
import defaultImage from '@/app/_assets/default-image.png';

function EditAlbumDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const albumDetail = useSelector((state) => state.albumDetail);

  const [singles, setSingles] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [songsAdded, setSongsAdded] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(asyncReceiveAlbumDetail(id));
  }, [dispatch, id]);

  const openModal = async () => {
    try {
      const songs = await api.getOwnedSingles();
      setSingles(songs);
      setCheckedState(new Array(songs.length).fill(false));
      setIsModalOpen(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteFromAlbum = (songId) =>
    dispatch(asyncDeleteSongFromAlbum(songId));

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const selectedSongs = updatedCheckedState
      .map((isChecked, index) => (isChecked ? singles[index] : null))
      .filter(Boolean);

    setSongsAdded(selectedSongs);
  };

  const addToAlbum = () => {
    dispatch(asyncAddSongsToAlbum(songsAdded));
    setIsModalOpen(false);
  };

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

  const column = [
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
  ];

  const filteredSongs = albumDetail?.songs.map((song) => {
    return {
      id: song.id,
      cover: (
        <Image
          className=""
          src={song.cover ? song.cover : defaultImage}
          width={60}
          height={60}
          alt="Song cover"
          priority
        />
      ),
      title: song.title,
      genre: song.genre,
      year: song.year,
      actions: (
        <button className={styles.remove_song_album} type="button" onClick={() => deleteFromAlbum(song.id)}>
          <FaRegTrashCan />
        </button>
      ),
    };
  });

  useEffect(() => {
    dispatch(asyncReceiveAlbumDetail(id));
  }, [dispatch, id]);

  return (
    <>
      <main className={styles.edit_album_detail_page}>
        {albumDetail && (
          <>
            <div className={styles.edit_album_info}>
              <Image
                src={albumDetail.coverUrl || defaultImage}
                width={200}
                height={200}
                alt="Album cover"
                priority
              />
              <h1>{albumDetail.name || ''}</h1>
            </div>
            <div className={styles.edit_album_song_list}>
              <button type="button" onClick={openModal}>
                Add Songs to Album
              </button>
              <DataTable
                title={`${albumDetail.songs.length} songs`}
                columns={column}
                data={filteredSongs}
                pagination
                theme="musictheme"
              ></DataTable>
            </div>
          </>
        )}
      </main>

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={modalStyles.modal_body}>
          <form className={modalStyles.select_singles}>
            {singles.map((single, index) => (
              <div className={modalStyles.single_item} key={single.id}>
                <label htmlFor={single.id}>
                  <Image
                    src={single.cover || defaultImage}
                    width={60}
                    height={60}
                    alt="Single cover"
                    priority
                  />
                  <p>{single.title}</p>
                </label>
                <input
                  type="checkbox"
                  id={single.id}
                  name={single.id}
                  value={single.id}
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
              </div>
            ))}
          </form>
          <button
            type="button"
            onClick={addToAlbum}
            className={modalStyles.add_singles_button}
            disabled={songsAdded.length ? false : true}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}

export default EditAlbumDetail;
