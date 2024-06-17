'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SongsList from '@/app/_components/songs/SongsList';
import Image from 'next/image';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import OfflineAudioIdb from '@/app/_utils/offline-audio-idb';
import shuffle from '@/app/_utils/shuffle';
import { formatTimeString } from '@/app/_utils/time-format';
import { FaPlay, FaShuffle } from 'react-icons/fa6';
import styles from '../../../_styles/style.module.css';
import downloaded from '../../../_assets/downloaded.png';

function DownloadedSongs() {
  const dispatch = useDispatch();

  const authUser = useSelector((states) => states.authUser);
  
  const [offlineSongs, setOfflineSongs] = useState([]);
  const [shuffleSongs, setShuffleSongs] = useState(false);

  useEffect(() => {
    const fetchOfflineSongs = async () => {
      const offline = await OfflineAudioIdb.getAllSongs();
      setOfflineSongs(offline);
    };

    fetchOfflineSongs();
  }, [dispatch]);

  const toggleShuffle = () => setShuffleSongs((prev) => !prev);

  const playAllSongs = (tracks) => {
    if (shuffleSongs) {
      dispatch(setNewTracksQueue(shuffle(tracks)));
    } else {
      dispatch(setNewTracksQueue(tracks));
    }
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(offlineSongs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  return (
    <main>
      <section className={styles.liked_songs_detail}>
        <div className={styles.liked_songs_cover}>
          <Image src={downloaded} width={200} height={200} alt="Downloaded songs" priority />
        </div>
        <div className={styles.liked_songs_info}>
          <h1>Downloaded</h1>
          <p>
            {offlineSongs.length} songs,{' '}
            {formatTimeString(offlineSongs.reduce((acc, song) => acc + song.duration, 0))}
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
        songs={offlineSongs}
        onPlayHandler={playTrack}
        playlists={[]}
        authUser={authUser ? authUser.id : ''}
      />
    </main>
  );
}

export default DownloadedSongs;
