'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetPlaylists,
  asyncAddPlaylist,
} from '@/app/_states/playlists/action';
import useInput from '@/app/_hooks/useInput';
import Modal from '@/app/_components/Modal';
import PlaylistsList from '@/app/_components/playlists/PlaylistsList';

function Collections() {
  const playlists = useSelector((states) => states.playlists);
  const [name, onNameChange] = useInput('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addPlaylist = (name) => {
    dispatch(asyncAddPlaylist(name));
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(asyncGetPlaylists());
  }, [dispatch]);

  return (
    <main>
      <h1>Collection Page</h1>
      <button type="button" onClick={() => openModal()}>
        add playlist
      </button>
      <section>
        <h2>Liked Songs</h2>
      </section>
      <section>
        <h2>Liked Albums</h2>
      </section>
      <section>
        <h2>Followed Artists</h2>
      </section>
      <section>
        <h2>Playlists</h2>
        <PlaylistsList playlists={playlists} />
      </section>
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        <form>
          <input
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Playlist name"
          />
          <button type="button" onClick={() => addPlaylist(name)}>
            Submit
          </button>
        </form>
      </Modal>
    </main>
  );
}

export default Collections;
