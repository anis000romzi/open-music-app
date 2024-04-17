'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import { asyncReceivePlaylistDetail } from '@/app/_states/playlistDetail/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';
import styles from '../../../_styles/style.module.css';

function PlaylistDetail() {
  const playlists = useSelector((states) => states.playlists);
  const playlistDetail = useSelector((states) => states.playlistDetail);
  const authUser = useSelector((states) => states.authUser);
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncGetPlaylists());
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
    <main className={styles.playlist_page}>
      {playlistDetail && (
        <>
          <div className={styles.playlist_title}>
            <h1>
              {playlistDetail.name}{' '}
              <button
                type="button"
                onClick={() => setEdit((current) => !current)}
              >
                <AiOutlineEdit />
              </button>
            </h1>
          </div>
          <SongsList
            songs={playlistDetail.songs}
            onPlayHandler={playTrack}
            playlists={playlists}
            authUser={authUser ? authUser.id : ''}
          />
        </>
      )}
    </main>
  );
}

export default PlaylistDetail;
