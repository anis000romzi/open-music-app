'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetLikedSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
} from '@/app/_states/songs/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';

function LikedSongs() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const songs = useSelector((states) => states.songs);
  const playlists = useSelector((states) => states.playlists);

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    dispatch(asyncGetLikedSongs());
  }, [dispatch]);

  const playAll = (tracks) => {
    dispatch(setNewTracksQueue(tracks));
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(songs));
    dispatch(setPlayingTrack(songId));
    dispatch(setIsPlaying());
    localStorage.setItem(
      'tracks-queue-index',
      songs.findIndex((track) => track.id === songId)
    );
  };

  const onLike = (id) => {
    dispatch(asyncLikeSong(id));
  };

  const onDeleteLike = (id) => {
    dispatch(asyncDeleteLikeSong(id));
  };

  return (
    <main>
      <h1>Liked Songs</h1>
      <SongsList
        songs={songs}
        onPlayHandler={playTrack}
        playlists={playlists}
        authUser={authUser ? authUser.id : ''}
        onLike={onLike}
        onDeleteLike={onDeleteLike}
      />
    </main>
  );
}

export default LikedSongs;
