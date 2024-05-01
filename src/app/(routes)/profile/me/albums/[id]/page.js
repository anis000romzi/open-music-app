'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  asyncReceiveAlbumDetail,
  asyncDeleteSongFromAlbum,
  asyncAddSongsToAlbum,
} from '@/app/_states/albumDetail/action';
import api from '@/app/_utils/api';
import Modal from '@/app/_components/Modal';
import defaultImage from '@/app/_assets/default-image.png';

function EditAlbumDetail() {
  const albumDetail = useSelector((states) => states.albumDetail);
  const [singles, setSingles] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [songsAdded, setSongsAdded] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncReceiveAlbumDetail(id));
  }, [dispatch, id]);

  const openModal = async () => {
    const songs = await api.getOwnedSingles();
    setSingles(songs);
    setCheckedState([...songs].fill(false));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteFromAlbum = (id) => {
    dispatch(asyncDeleteSongFromAlbum(id));
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const songsTobeAdded = updatedCheckedState
      .map((item, index) => {
        if (item) {
          return singles[index];
        }
      })
      .filter((item) => item !== undefined);

    setSongsAdded(songsTobeAdded);
  };

  const addToAlbum = () => {
    dispatch(asyncAddSongsToAlbum(songsAdded));
  };

  return (
    <main>
      <button type="button" onClick={openModal}>
        Add Songs To Album
      </button>
      <button type="button">Delete Album</button>
      {albumDetail && (
        <>
          <h1>{albumDetail.name}</h1>
          <p>{albumDetail.songs.length} song(s)</p>
          <div>
            {albumDetail.songs.map((song) => (
              <div key={song.id}>
                <Image
                  src={song.cover ? song.cover : defaultImage}
                  width={50}
                  height={50}
                  alt="Album cover"
                  priority
                />
                <div>
                  <strong>{song.title}</strong>
                  <p>{song.year}</p>
                </div>
                <button onClick={() => deleteFromAlbum(song.id)}>
                  Delete From Album
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        <button
          type="button"
          onClick={addToAlbum}
          disabled={songsAdded.length ? false : true}
        >
          Confirm
        </button>
        <form>
          {singles.map((single, index) => (
            <div key={single.id}>
              <label htmlFor={single.id}>
                <input
                  type="checkbox"
                  id={single.id}
                  name={single.id}
                  value={single.id}
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
                {single.title}
              </label>
            </div>
          ))}
        </form>
      </Modal>
    </main>
  );
}

export default EditAlbumDetail;
