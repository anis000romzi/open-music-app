'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineEdit, AiOutlineClose, AiOutlineCheck } from 'react-icons/ai';
import {
  asyncReceivePlaylistDetail,
  asyncEditPlaylistDetail,
} from '@/app/_states/playlistDetail/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import SongsList from '@/app/_components/songs/SongsList';
import styles from '../../../_styles/style.module.css';
import useInput from '@/app/_hooks/useInput';

function PlaylistDetail() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const playlists = useSelector((states) => states.playlists);
  const playlistDetail = useSelector((states) => states.playlistDetail);
  const [edit, setEdit] = useState(false);
  const [playlistName, onPlaylistNameChange, setPlaylistName] = useInput();

  const { id } = useParams();

  if (!authUser || !authUser.is_active) {
    redirect('/');
  }

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    dispatch(asyncReceivePlaylistDetail(id));
  }, [dispatch, id]);

  const editPlaylist = (id, name) => {
    dispatch(asyncEditPlaylistDetail(id, name));
  };

  const playAll = (tracks) => {
    dispatch(setNewTracksQueue(tracks));
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(playlistDetail.songs));
    dispatch(setPlayingSongInQueue(songId));
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
            {edit ? (
              <form>
                <input
                  type="text"
                  value={playlistName}
                  onChange={onPlaylistNameChange}
                  placeholder="Playlist Name"
                />
                <button
                  type="button"
                  onClick={() => {
                    editPlaylist(playlistDetail.id, playlistName);
                    setEdit(false);
                  }}
                >
                  <AiOutlineCheck />
                </button>
              </form>
            ) : (
              ''
            )}
            <h1>
              {edit ? '' : playlistDetail.name}{' '}
              <button
                type="button"
                onClick={() => {
                  setPlaylistName(playlistDetail.name);
                  setEdit((current) => !current);
                }}
              >
                {edit ? <AiOutlineClose /> : <AiOutlineEdit />}
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
