'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/app/_components/Modal';
import PopularPlaylistsList from '@/app/_components/playlists/PopularPlaylistsList';
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
import api from '@/app/_utils/api';
import { RiPlayListAddFill } from 'react-icons/ri';
import styles from '../../_styles/style.module.css';
import modalStyles from '../../_styles/modal.module.css';
import heart from '../../_assets/heart.png';
import history from '../../_assets/history.png';

function Collections() {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.authUser);
  const users = useSelector((state) => state.users);
  const songs = useSelector((state) => state.songs);
  const albums = useSelector((state) => state.albums);
  const playlists = useSelector((state) => state.playlists);

  const [name, onNameChange] = useInput('');
  const [isPublic, setIsPublic] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedPlaylist, setLikedPlaylist] = useState([]);

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const addPlaylist = useCallback(() => {
    dispatch(asyncAddPlaylist(name, isPublic));
    setIsModalOpen(false);
  }, [dispatch, name, isPublic]);

  const deletePlaylist = useCallback((playlistId) => {
    dispatch(asyncDeletePlaylist(playlistId));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const playlist = await api.getLikedPlaylists();
      setLikedPlaylist(playlist);
    };

    fetchData();
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
          <Image src={history} width={70} height={70} alt="History" priority />
          <Link href={`collections/songs/liked`}>
            <strong>History</strong>
          </Link>
        </section> */}
        <section className={styles.liked_songs}>
          <Image src={heart} width={70} height={70} alt="Liked Songs" priority />
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
        {likedPlaylist.length > 0 && (
          <section>
            <h2>Liked Playlists</h2>
            <PopularPlaylistsList playlists={likedPlaylist} />
          </section>
        )}
        <section>
          <h2>Playlists</h2>
          <button
            type="button"
            className={styles.add_playlist}
            onClick={openModal}
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
                checked={isPublic}
                onChange={() => setIsPublic((prev) => !prev)}
              />
            </div>
            <button type="button" onClick={addPlaylist}>
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Collections;
