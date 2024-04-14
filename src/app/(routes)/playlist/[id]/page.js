'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { asyncReceivePlaylistDetail } from '@/app/_states/playlistDetail/action';
import {
  setNewTracksQueue,
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';

function PlaylistDetail() {
  const playlistDetail = useSelector((states) => states.playlistDetail);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncReceivePlaylistDetail(id));
  }, [dispatch, id]);

  const playAll = (tracks) => {
    dispatch(setNewTracksQueue(tracks));
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(playlistDetail.songs));
    dispatch(setPlayingTrack(songId));
    dispatch(setIsPlaying());
    localStorage.setItem(
      'tracks-queue-index',
      playlistDetail.songs.findIndex((track) => track.id === songId)
    );
  };

  return (
    <main>
      {playlistDetail && (
        <>
          <h1>{playlistDetail.name}</h1>
          <SongsList songs={playlistDetail.songs} onPlayHandler={playTrack} />
        </>
      )}
    </main>
  );
}

export default PlaylistDetail;
