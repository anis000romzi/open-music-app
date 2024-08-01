'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/app/_components/Modal';
import AlbumsList from '@/app/_components/albums/AlbumsList';
import PlaylistsList from '@/app/_components/playlists/PlaylistsList';
import ArtistsList from '@/app/_components/artists/ArtistsList';
import {
  asyncGetPlaylists,
  asyncAddPlaylist,
  asyncDeletePlaylist,
} from '@/app/_states/playlists/action';
import { asyncGetLikedAlbums } from '@/app/_states/albums/action';
import { asyncGetLikedSongs } from '@/app/_states/songs/action';
import { asyncGetFollowedArtists } from '@/app/_states/users/action';
import { redirect } from 'next/navigation';
import { RiPlayListAddFill } from 'react-icons/ri';
import styles from '../../_styles/style.module.css';
import modalStyles from '../../_styles/modal.module.css';
import heart from '../../_assets/heart.png';
import history from '../../_assets/history.png';

function Collections() {
  const dispatch = useDispatch();

  const authUser = useSelector((states) => states.authUser);
  const users = useSelector((states) => states.users);
  const songs = useSelector((states) => states.songs);
  const albums = useSelector((states) => states.albums);
  const playlists = useSelector((states) => states.playlists);

  const [name, onNameChange] = useInput('');
  const [isPublic, setIsPublic] = useState(false);
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

  const addPlaylist = (name, isPublic) => {
    dispatch(asyncAddPlaylist(name, isPublic));
    setIsModalOpen(false);
  };

  const deletePlaylist = (playlistId) => {
    dispatch(asyncDeletePlaylist(playlistId));
  };

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    dispatch(asyncGetLikedAlbums());
    dispatch(asyncGetLikedSongs());
    dispatch(asyncGetFollowedArtists());
  }, [dispatch]);

  return (
    <>
      <main className={styles.collection_page}>
        <h1 className={styles.your_collection}>Your Collection</h1>
        {/* <section className={styles.liked_songs}>
          <Image
            src={history}
            width={70}
            height={70}
            alt="History"
            priority
          />
          <Link href={`collections/songs/liked`}>
            <strong>History</strong>
          </Link>
        </section> */}
        <section className={styles.liked_songs}>
          <Image
            src={heart}
            width={70}
            height={70}
            alt="Liked Songs"
            priority
          />
          <Link href={`collections/songs/liked`}>
            <strong>Liked Songs</strong>
            <p>{songs.length} song(s)</p>
          </Link>
        </section>
        {albums.length > 0 && (
          <section>
            <h2>Liked Albums</h2>
            <AlbumsList albums={albums} />
          </section>
        )}
        {users.length > 0 && (
          <section>
            <h2>Followed Artists</h2>
            <ArtistsList artists={users} />
          </section>
        )}
        <section>
          <h2>Playlists</h2>
          <button
            type="button"
            className={styles.add_playlist}
            onClick={() => openModal()}
          >
            <RiPlayListAddFill /> <span> New Playlist</span>
          </button>
          <PlaylistsList
            authUser={authUser}
            playlists={playlists}
            onDeletePlaylist={deletePlaylist}
          />
        </section>
      </main>

      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        <div className={modalStyles.modal_header}>
          <strong>New Playlist</strong>
        </div>
        <div className={modalStyles.modal_body}>
          <form className={modalStyles.new_playlist_form}>
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Playlist name"
            />
            <div className={modalStyles.is_public}>
              <label htmlFor="is-public">Set as public</label>
              <input
                type="checkbox"
                id="is-public"
                name="is-public"
                value={isPublic}
                checked={isPublic}
                onChange={() => setIsPublic((current) => !current)}
              />
            </div>
            <button type="button" onClick={() => addPlaylist(name, isPublic)}>
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Collections;
