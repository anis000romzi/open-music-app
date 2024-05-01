'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TbPlaylistAdd } from 'react-icons/tb';
import Link from 'next/link';
import Image from 'next/image';
import {
  asyncGetPlaylists,
  asyncAddPlaylist,
  asyncDeletePlaylist,
} from '@/app/_states/playlists/action';
import { asyncGetLikedAlbums } from '@/app/_states/albums/action';
import { asyncGetLikedSongs } from '@/app/_states/songs/action';
import useInput from '@/app/_hooks/useInput';
import Modal from '@/app/_components/Modal';
import LikedAlbumsList from '@/app/_components/albums/LikedAlbumsList';
import PlaylistsList from '@/app/_components/playlists/PlaylistsList';
import styles from '../../_styles/style.module.css';
import whiteRedHeart from '../../_assets/white-heart-red-background.jpg';

function Collections() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const songs = useSelector((states) => states.songs);
  const albums = useSelector((states) => states.albums);
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
    dispatch(asyncGetLikedAlbums());
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
      <h1 className={styles.your_collection}>Your Collection</h1>
      <section className={styles.liked_songs}>
        <Image
          src={whiteRedHeart}
          width={70}
          height={70}
          alt="Liked Songs"
          priority
        />
        <Link href={`collections/songs`}>
          <strong>Liked Songs</strong>
          <p>{songs.length} song(s)</p>
        </Link>
      </section>
      <section>
        <LikedAlbumsList albums={albums} />
      </section>
      {/* <section>
        <h2>Followed Artists</h2>
      </section> */}
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
