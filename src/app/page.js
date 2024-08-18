'use client';
import styles from './_styles/style.module.css';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularSongs } from './_states/songs/action';
import { asyncGetPopularAlbums } from './_states/albums/action';
import { asyncGetPopularArtists } from './_states/users/action';
import { asyncGetPlaylists } from './_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from './_states/queue/action';
import PopularSongsList from './_components/songs/PopularSongsList';
import AlbumsList from './_components/albums/AlbumsList';
import ArtistsList from './_components/artists/ArtistsList';
import PopularPlaylistsList from './_components/playlists/PopularPlaylistsList';
import HistoryList from './_components/history/HistoryList';
import api from './_utils/api';

export default function Home() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const songs = useSelector((state) => state.songs);
  const albums = useSelector((state) => state.albums);
  const users = useSelector((state) => state.users);
  const playlists = useSelector((state) => state.playlists);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    if (authUser) {
      const historyData = await api.getHistory();
      setHistory(historyData);
    }
  }, [authUser]);

  const fetchPopularPlaylists = useCallback(async () => {
    const playlists = await api.getPopularPlaylists();
    setPopularPlaylists(playlists);
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchPopularPlaylists();
    dispatch(asyncGetPopularSongs());
    dispatch(asyncGetPopularAlbums());
    dispatch(asyncGetPopularArtists());
    if (authUser) {
      dispatch(asyncGetPlaylists());
    }
  }, [dispatch, fetchHistory, fetchPopularPlaylists, authUser]);

  const playSong = useCallback(
    (songId) => {
      dispatch(setNewTracksQueue(history));
      dispatch(setPlayingSongInQueue(songId));
      dispatch(setIsPlaying(true));
    },
    [dispatch, history]
  );

  return (
    <main>
      {history.length > 0 && (
        <section className={styles.history_section}>
          <h2 className={styles.popular_album}>History</h2>
          <HistoryList songs={history} onPlayHandler={playSong} />
        </section>
      )}
      <section className={styles.popular_song_section}>
        <h2 className={styles.popular_album}>Popular Songs</h2>
        <PopularSongsList songs={songs} authUser={authUser} playlists={playlists} />
      </section>
      {albums.length > 0 && (
        <section className={styles.popular_album_section}>
          <h2 className={styles.popular_album}>Popular Albums</h2>
          <AlbumsList albums={albums} />
        </section>
      )}
      {users.length > 0 && (
        <section className={styles.popular_artist_section}>
          <h2 className={styles.popular_album}>Popular Artists</h2>
          <ArtistsList artists={users} />
        </section>
      )}
      {playlists.length > 0 && (
        <section className={styles.popular_playlist_section}>
          <h2 className={styles.popular_album}>Popular Playlists</h2>
          <PopularPlaylistsList playlists={popularPlaylists} />
        </section>
      )}
    </main>
  );
}
