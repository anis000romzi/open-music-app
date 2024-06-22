'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import SongsList from '@/app/_components/songs/SongsList';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  asyncGetSongsByGenre,
  asyncLikeSong,
  asyncDeleteLikeSong,
} from '@/app/_states/songs/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import styles from '../../../_styles/style.module.css';

function Genre() {
  const { genre } = useParams();
  const dispatch = useDispatch();

  const songs = useSelector((state) => state.songs);
  const playlists = useSelector((state) => state.playlists);
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    if (authUser) {
      dispatch(asyncGetPlaylists());
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    dispatch(asyncGetSongsByGenre(genre));
  }, [dispatch, genre]);

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  const handleLikeSong = (id, isLiked) => {
    dispatch(isLiked ? asyncDeleteLikeSong(id) : asyncLikeSong(id));
  };

  return (
    <main className={styles.song_by_genre_page}>
      <h1>{genre}</h1>
      {songs.length > 0 && (
        <section>
          <SongsList
            songs={songs}
            onPlayHandler={playSong}
            playlists={playlists}
            authUser={authUser?.id}
            onLike={handleLikeSong}
            onDeleteLike={handleLikeSong}
          />
        </section>
      )}
    </main>
  );
}

export default Genre;
