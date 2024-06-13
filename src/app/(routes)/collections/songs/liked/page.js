'use client';
// hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components
import Image from 'next/image';
import SongsList from '@/app/_components/songs/SongsList';

// redux actions
import {
  asyncGetLikedSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
} from '@/app/_states/songs/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';

// utils
import shuffle from '@/app/_utils/shuffle';
import { formatTimeString } from '@/app/_utils/time-format';
import { redirect } from 'next/navigation';

// icons
import { FaPlay, FaShuffle } from 'react-icons/fa6';

// styles
import styles from '../../../../_styles/style.module.css';

// assets
import heart from '../../../../_assets/heart.png';

function LikedSongs() {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.authUser);
  const songs = useSelector((state) => state.songs);
  const playlists = useSelector((state) => state.playlists);

  const [shuffleSongs, setShuffleSongs] = useState(false);

  useEffect(() => {
    if (!authUser || !authUser.is_active) {
      redirect('/');
    }
    dispatch(asyncGetPlaylists());
    dispatch(asyncGetLikedSongs());
  }, [dispatch, authUser]);

  const toggleShuffle = () => setShuffleSongs((prev) => !prev);

  const playAllSongs = () => {
    const tracks = shuffleSongs ? shuffle(songs) : songs;
    dispatch(setNewTracksQueue(tracks));
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying());
    localStorage.setItem(
      'tracks-queue-index',
      songs.findIndex((track) => track.id === songId)
    );
  };

  const handleLike = (id) => dispatch(asyncLikeSong(id));
  const handleDeleteLike = (id) => dispatch(asyncDeleteLikeSong(id));

  return (
    <main>
      <section className={styles.liked_songs_detail}>
        <div className={styles.liked_songs_cover}>
          <Image src={heart} width={200} height={200} alt="Liked songs" priority />
        </div>
        <div className={styles.liked_songs_info}>
          <h1>Liked Songs</h1>
          <p>
            {songs.length} songs,{' '}
            {formatTimeString(songs.reduce((acc, song) => acc + song.duration, 0))}
          </p>
        </div>
        <div className={styles.liked_songs_buttons}>
          <button
            className={`${styles.shuffle_button} ${shuffleSongs ? styles.active : ''}`}
            type="button"
            onClick={toggleShuffle}
          >
            <FaShuffle />
          </button>
          <button
            className={styles.play_all_button}
            type="button"
            onClick={playAllSongs}
          >
            <FaPlay />
          </button>
        </div>
      </section>
      <SongsList
        songs={songs}
        onPlayHandler={playTrack}
        playlists={playlists}
        authUser={authUser?.id}
        onLike={handleLike}
        onDeleteLike={handleDeleteLike}
      />
    </main>
  );
}

export default LikedSongs;
