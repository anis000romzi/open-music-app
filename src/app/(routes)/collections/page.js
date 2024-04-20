'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TbPlaylistAdd } from 'react-icons/tb';
import Link from 'next/link';
import {
  asyncGetPlaylists,
  asyncAddPlaylist,
  asyncDeletePlaylist,
} from '@/app/_states/playlists/action';
import { asyncGetLikedSongs } from '@/app/_states/songs/action';
import useInput from '@/app/_hooks/useInput';
import Modal from '@/app/_components/Modal';
import PlaylistsList from '@/app/_components/playlists/PlaylistsList';
import styles from '../../_styles/style.module.css';

function Collections() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const songs = useSelector((states) => states.songs);
  const playlists = useSelector((states) => states.playlists);

  const [name, onNameChange] = useInput('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

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

  const deletePlaylist = (playlistId) => {
    dispatch(asyncDeletePlaylist(playlistId));
  };

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    dispatch(asyncGetLikedSongs());
  }, [dispatch]);

  return (
    <main>
      <button
        type="button"
        className={styles.add_playlist_button}
        onClick={() => openModal()}
      >
        <TbPlaylistAdd />
      </button>
      <section>
        <Link href={`collections/songs`}>
          <h2>Liked Songs</h2>
          <p>{songs.length} song(s)</p>
        </Link>
      </section>
      <section>
        <h2>Liked Albums</h2>
      </section>
      <section>
        <h2>Followed Artists</h2>
      </section>
      <section>
        <PlaylistsList
          playlists={playlists}
          onDeletePlaylist={deletePlaylist}
        />
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
